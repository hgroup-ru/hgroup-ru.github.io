export function foldRussianSearchText(value: string): string {
  return value.replaceAll("\u{451}", "\u{435}");
}
