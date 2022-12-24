import { space, editor } from "$sb/silverbullet-syscall/mod.ts";
import { readSettings } from "$sb/lib/settings_page.ts";
import { events } from "$sb/plugos-syscall/mod.ts";


async function randomPageFromSet(pages) {
  const choice = Math.floor(Math.random() * pages.length);
  await editor.navigate(pages[choice].name);
}

export async function randomPage() {
  const pages = await space.listPages();
  await randomPageFromSet(pages);
}

export async function randomPageExcludeDaily() {
  const pages = await space.listPages();
  const settings = await readSettings({ dailyNotePrefix: null });
  const prefix = settings['dailyNotePrefix'];
  console.log(prefix);
  const subset = pages.filter(p => !prefix || !p.name.startsWith(prefix));
  await randomPageFromSet(subset);
}

export async function randomPageWithTag() {
  const tag = await editor.prompt('Random page must contain tag:');

  if (!tag) {
    return;
  }

  let pages: Array<Array<any>> = await events.dispatchEvent(
    'query:page',
    { query: { table: 'page', filter: [{ op: '=', prop: 'tags', value: tag }] } },
    10 * 1000,
  );

  console.log(pages);

  if (pages[0].length === 0) {
    return;
  }

  await randomPageFromSet(pages[0]);
}

