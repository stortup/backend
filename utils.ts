// omit _id

type Document = {
  _id: unknown;
};

export type View<T extends Document> =
  | { id: T["_id"] }
  | {
    [P in keyof Omit<T, "_id">]?: T[P];
  };

// document to view
export function toView<T extends Document>(
  { _id, ...rest }: Document,
): View<T> {
  return {
    id: _id,
    ...rest,
  };
}
