import Main from "../../components/Main";

type Params = {
  searchParams?: {
    title?: string | string[];
  };
};

export default async function ListenPage({ searchParams }: Params) {

  const sp = searchParams ? await (searchParams as any) : undefined;
  let title: string | null = null;
  const raw = sp?.title;
  if (Array.isArray(raw)) {
    title = raw[0] ?? null;
  } else if (typeof raw === "string") {
    title = raw;
  }

  return <Main fileTitle={title} />;
}
