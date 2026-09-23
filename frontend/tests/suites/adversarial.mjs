/**
 * Tries to break the app the way a confused captain, a hurried organiser, or
 * someone poking at URLs would.
 *
 * Every check in here corresponds to a defect that was actually shipped at
 * some point, so they are regression guards rather than speculation.
 */
import { makeReporter, signInAdmin, ADMIN_EMAIL } from '../lib/cdp.mjs'

export const name = 'adversarial'

export async function run(d) {
  const r = makeReporter('adversarial')
  await d.viewport(1280, 900)

  r.section('Access control')
  await d.goto('/')
  await d.evaluate('localStorage.clear()')

  await d.goto('/admin')
  r.check('admin console is gated', (await d.text()).includes('Admin sign-in required'))
  r.check('admin navigation does not leak through the gate',
    !(await d.text()).includes('Teams & Logins'))
  await d.goto('/admin/teams')
  r.check('admin sub-pages are gated too', (await d.text()).includes('Admin sign-in required'))
  await d.goto('/team')
  r.check('team portal is gated', (await d.text()).includes('Team sign-in required'))

  r.section('Admin sign-in')
  await d.goto('/login')
  await d.clickText('Admin')
  await d.pause(300)
  await d.setValue('input[name="email"]', ADMIN_EMAIL)
  await d.setValue('input[name="password"]', 'definitely-wrong')
  await d.evaluate(`document.querySelector('form button[type="submit"]').click()`)
  await d.pause(1300)
  r.check('wrong admin password is refused',
    (await d.path()) === '/login' && (await d.evaluate(`!!document.querySelector('[role="alert"]')`)))

  await signInAdmin(d)
  r.check('correct admin credentials open the console',
    (await d.path()) === '/admin' && !(await d.text()).includes('Admin sign-in required'))

  r.section('Registration input handling')
  await d.goto('/admin')
  await d.setValue('#t-name', 'Bug Hunt Cup')
  await d.setValue('#t-venue', 'Rooftop Lounge')
  await d.clickText('Create tournament')
  await d.pause(600)

  await d.goto('/admin/teams')
  for (const teamName of ['Alpha', 'Bravo', 'Charlie', 'Delta']) {
    await d.setValue('#team-name', teamName)
    await d.clickText('Add team')
    await d.pause(220)
  }
  await d.setValue('#team-name', 'alpha')
  await d.clickText('Add team')
  await d.pause(350)
  r.check('duplicate name rejected case-insensitively', (await d.text()).includes('already registered'))
  await d.setValue('#team-name', '   ')
  await d.clickText('Add team')
  await d.pause(350)
  r.check('whitespace-only name rejected', (await d.text()).includes('Enter a team name'))
  r.check('exactly four teams survive the bad input', (await d.text()).includes('Registered teams (4)'))

  r.section('Seeded draw')
  await d.goto('/admin')
  await d.evaluate(`(() => {
    const seeded = [...document.querySelectorAll('input[name="draw-mode"]')]
      .find(el => el.value === 'seeded');
    if (seeded) { seeded.click(); return true; }
    return false;
  })()`)
  await d.pause(250)
  await d.clickText('Draw')
  await d.pause(800)
  const drawn = await d.store()
  const ids = drawn.teams.map((t) => t.id)
  const first = drawn.matches.filter((m) => m.roundIndex === 0 && m.status !== 'bye')
  r.check('seeded draw is recorded', drawn.tournament?.drawMode === 'seeded',
    String(drawn.tournament?.drawMode))
  r.check('seeded draw pairs strongest against weakest',
    first.length > 0 && first[0].teamAId === ids[0] && first[0].teamBId === ids[ids.length - 1],
    `first match was ${first[0]?.teamAId} vs ${first[0]?.teamBId}`)

  r.section('Venue propagation')
  await d.goto('/admin/fixtures')
  await d.evaluate(`(() => {
    const set = (el, v) => {
      const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
      desc.set.call(el, v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    document.querySelectorAll('input[id$="-table"]').forEach((el, i) => set(el, 'T' + (i + 1)));
    document.querySelectorAll('input[id$="-time"]').forEach((el) => set(el, '2026-09-26T15:00'));
  })()`)
  await d.pause(450)
  await d.clickText('Publish')
  await d.pause(700)
  await d.goto('/fixtures')
  const cards = await d.evaluate(
    `[...document.querySelectorAll('article')].map(a => a.innerText).join(' | ')`)
  r.check('match cards use the tournament venue',
    cards.includes('Rooftop Lounge') && !cards.includes('Cafe'),
    cards.includes('Cafe') ? 'cards still hardcode "Cafe"' : 'venue missing from cards')

  r.section('Editing a published fixture')
  await d.goto('/admin/fixtures')
  const before = (await d.store()).notices.length
  await d.evaluate(`(() => {
    const el = document.querySelector('input[id$="-time"]');
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
    desc.set.call(el, '2026-09-26T19:30');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  })()`)
  await d.pause(500)
  const after = (await d.store()).notices.length
  r.check('changing a published kickoff notifies both teams', after > before, `${before} -> ${after}`)

  await d.evaluate(`(() => {
    const el = document.querySelector('input[id$="-table"]');
    const desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value');
    desc.set.call(el, '');
    el.dispatchEvent(new Event('input', { bubbles: true }));
  })()`)
  await d.pause(500)
  const snapshot = await d.store()
  const live = snapshot.matches.find((m) => m.roundIndex === 0 && m.status !== 'bye')
  r.check('a published match cannot be left without a table',
    !(snapshot.tournament.rounds[0].published && live.status === 'unscheduled'),
    `published round holds a match in "${live.status}" with table "${live.table}"`)

  r.section('Undoing a result')
  await d.goto('/admin/live')
  await d.clickText('Start match')
  await d.pause(450)
  await d.evaluate(`(() => {
    const cards = [...document.querySelectorAll('div')].filter(el =>
      el.textContent.includes('Who won?') && el.querySelectorAll('button').length >= 2);
    cards[cards.length - 1].querySelector('button').click();
  })()`)
  await d.pause(600)
  const afterResult = await d.store()
  const eliminated = afterResult.teams.filter((t) => t.status === 'eliminated').length
  r.check('recording a winner eliminates the loser', eliminated === 1, `${eliminated} eliminated`)

  await d.clickText('Undo this result')
  await d.pause(600)
  const afterUndo = await d.store()
  r.check('undo puts the loser back in the draw',
    afterUndo.teams.filter((t) => t.status === 'eliminated').length === 0)
  r.check('undo clears the recorded winner',
    afterUndo.matches.filter((m) => m.roundIndex === 0 && m.status === 'completed').length === 0)

  r.section('Old URLs')
  for (const [from, to] of [
    ['/standings', '/bracket'],
    ['/team/standing', '/team/bracket'],
    ['/team/results', '/team/matches'],
    ['/admin/players', '/admin/teams'],
  ]) {
    await d.goto(from, 1100)
    r.check(`${from} redirects to ${to}`, (await d.path()) === to, `landed on ${await d.path()}`)
  }

  r.section('Team portal')
  const creds = (await d.store()).teams
  await d.goto('/login')
  await d.setValue('input[name="team-code"]', creds[0].code)
  await d.setValue('input[name="password"]', creds[0].password)
  await d.evaluate(`document.querySelector('form button[type="submit"]').click()`)
  await d.pause(1700)
  r.check('team sign-in reaches the portal', (await d.path()) === '/team', await d.path())

  await d.goto('/team/account')
  await d.clickText('Log out')
  await d.pause(1300)
  await d.goto('/login')
  await d.setValue('input[name="team-code"]', creds[0].code.toLowerCase())
  await d.setValue('input[name="password"]', creds[0].password)
  await d.evaluate(`document.querySelector('form button[type="submit"]').click()`)
  await d.pause(1700)
  r.check('team ID is case-insensitive', (await d.path()) === '/team', await d.path())

  for (const route of ['/team', '/team/profile', '/team/matches', '/team/bracket', '/team/account']) {
    await d.goto(route)
    const writable = await d.evaluate(
      `[...document.querySelectorAll('input, textarea, select')].filter(el => !el.disabled).length`)
    r.check(`${route} has no editable field`, writable === 0, `${writable} enabled inputs`)
  }

  r.section('Notification badge')
  await d.goto('/team/notifications')
  await d.pause(800)
  await d.goto('/team')
  const badge = await d.evaluate(`(() => {
    const el = [...document.querySelectorAll('a')]
      .find(a => (a.getAttribute('aria-label') || '').includes('Notifications'));
    return el ? el.getAttribute('aria-label') : 'none';
  })()`)
  r.check('badge clears once notifications are read', !/\d+ unread/.test(badge), `badge reads "${badge}"`)

  r.section('Sessions end')
  await d.goto('/team/account')
  await d.clickText('Log out')
  await d.pause(1300)
  await d.goto('/team')
  r.check('team sign-out ends the session', (await d.text()).includes('Team sign-in required'))

  await signInAdmin(d)
  await d.goto('/admin')
  await d.clickText('Log out')
  await d.pause(1000)
  await d.goto('/admin')
  r.check('admin sign-out ends the session', (await d.text()).includes('Admin sign-in required'))

  r.section('Persistence')
  await signInAdmin(d)
  await d.goto('/admin/teams')
  r.check('registered teams survive a reload', (await d.text()).includes('Registered teams (4)'))

  return r.finish()
}
