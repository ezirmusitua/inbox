export class SaveArticleDto {
  public readonly url: string;
  public readonly title: string;
  public readonly content: string;
}

export class TakeClipDto {
  public readonly url: string;
  public readonly title: string;
  public readonly selection: string;
}
