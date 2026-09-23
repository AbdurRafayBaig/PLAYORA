/**
 * Plays a complete knockout from an empty app to a crowned champion, then
 * signs in as that champion and checks what a captain actually sees.
 *
 * Covers the two properties that matter most and are easiest to break:
 * every match ends with exactly one winner, and exactly one team is left
 * standing at the end.
 */
import { makeReporter, signInAdmin } from '../lib/cdp.mjs'

export const name = 'tournament'

export async function run(d) {
  const r = makeReporter('tournament')

  await d.viewport(1280, 900)

  /** Fill any unassigned table/time in the drawn rounds, then publish. */
  const scheduleAndPublish = async () => {
    await d.goto('/admin/fixtures')
    await d.evaluate(`(() => {
      const set = (el, v) => {
        const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
        desc.set.call(el, v);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      document.querySelectorAll('input[id$="-table"]').forEach((el, i) => {
        if (!el.value) set(el, 'T' + (i + 1));
      });
      document.querySelectorAll('input[id$="-time"]').forEach((el) => {
        if (!el.value) set(el, '2026-09-26T15:00');
      });
    })()`)
    await d.pause(450)
    await d.evaluate(`[...document.querySelectorAll('button')]
      .filter(b => b.textContent.includes('Publish') && !b.disabled)
      .forEach(b => b.click())`)
    await d.pause(500)
  }

  /** Start and decide every playable match in the current round. */
  const playRound = async () => {
    await d.goto('/admin/live')
    for (let i = 0; i < 8; i++) {
      const started = await d.clickText('Start match')
      if (started) await d.pause(350)
      // Innermost element containing the prompt: an ancestor div also
      // "contains" it, and its button list includes the whole sidebar.
      const decided = await d.evaluate(`(() => {
        const cards = [...document.querySelectorAll('div')].filter(el =>
          el.textContent.includes('Who won?') && el.querySelectorAll('button').length >= 2);
        const card = cards[cards.length - 1];
        if (!card) return false;
        const winner = card.querySelector('button');
        if (!winner) return false;
        winner.click();
        return true;
      })()`)
      if (!started && !decided) break
      await d.pause(400)
    }
  }

  r.section('Empty app')
  await d.goto('/')
  await d.evaluate('localStorage.clear()')
  await d.goto('/')
  r.check('home shows an honest empty state', (await d.text()).includes('No tournament running yet'))

  r.section('Organiser sets up')
  await signInAdmin(d)
  await d.goto('/admin')
  r.check('offers tournament creation', (await d.text()).includes('Start a tournament'))
  await d.setValue('#t-name', 'Cafe Ludo Cup')
  await d.setValue('#t-venue', 'Cafe')
  await d.clickText('Create tournament')
  await d.pause(700)
  r.check('moves to registration', (await d.text()).includes('Registration open'))

  r.section('Register six teams')
  await d.goto('/admin/teams')
  const names = ['Thunder Hawks', 'Storm Riders', 'Phoenix Squad', 'Royal Knights', 'Silver Wolves', 'Iron Titans']
  for (const teamName of names) {
    await d.setValue('#team-name', teamName)
    await d.setValue('#p1', 'Captain')
    await d.clickText('Add team')
    await d.pause(230)
  }
  r.check('six teams registered', (await d.text()).includes('Registered teams (6)'))
  const registered = (await d.store()).teams
  r.check('team IDs are unique', new Set(registered.map((t) => t.code)).size === 6)
  r.check('passwords are eight characters', registered.every((t) => t.password.length === 8))

  r.section('Draw')
  await d.goto('/admin')
  r.check('shows the knockout path', (await d.text()).includes('6 → 3 → 2 → 1'))
  r.check('warns a bye is coming', (await d.text()).toLowerCase().includes('bye'))
  await d.clickText('Draw')
  await d.pause(800)
  r.check('tournament is running', (await d.text()).includes('What to do next'))

  r.section('Publishing is the gate')
  await d.goto('/fixtures')
  r.check('fixtures hidden before publish', (await d.text()).includes('No round published yet'))

  r.section('Play through to a champion')
  for (let round = 0; round < 6; round++) {
    const snapshot = await d.store()
    if (snapshot.tournament?.championId) break
    await scheduleAndPublish()
    await playRound()
    await d.goto('/admin')
    await d.clickText('Advance')
    await d.pause(700)
  }

  const final = await d.store()
  r.check('a champion was crowned', Boolean(final.tournament?.championId), String(final.tournament?.phase))
  r.check('exactly one champion', final.teams.filter((t) => t.status === 'champion').length === 1)
  r.check('the other five are eliminated', final.teams.filter((t) => t.status === 'eliminated').length === 5)
  r.check('a bye was awarded in the odd round', final.matches.some((m) => m.status === 'bye'))
  r.check('every match has exactly one winner', final.matches.every((m) => Boolean(m.winnerId)))

  r.section('Public bracket')
  await d.goto('/bracket')
  r.check('names the champion', (await d.text()).includes('Tournament winner'))
  r.check('explains why there is no points table', (await d.text()).includes('no points table'))

  r.section('Champion signs in')
  const champ = final.teams.find((t) => t.status === 'champion')
  await d.goto('/login')
  await d.setValue('input[name="team-code"]', champ.code)
  await d.setValue('input[name="password"]', champ.password)
  await d.evaluate(`document.querySelector('form button[type="submit"]').click()`)
  await d.pause(1700)
  r.check('lands on the portal', (await d.path()) === '/team', await d.path())
  r.check('sees they won', (await d.text()).includes('You won the tournament'))
  r.check('portal states it is read-only', (await d.text()).toLowerCase().includes('read-only'))
  await d.goto('/team/notifications')
  r.check('was notified about published rounds', (await d.text()).includes('fixture published'))

  return r.finish()
}
