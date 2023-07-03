import Link from "next/link";

type Props = {
  base: string;
  parent: Category;
  item: string;
};

const Breadcrumbs = ({ base, parent, item }: Props) => {
  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link href="/">
            Home
          </Link>
        </li>
        <li>
          <Link href={`/${base}/`}>
            {base.charAt(0).toUpperCase() + base.slice(1).toLowerCase()}
          </Link>
        </li>
        <li>
          <Link href={`/${base}/category/${parent.id}/${parent.slug}/`}>
            {parent.name}
          </Link>
        </li>
        <li>{item}</li>
      </ul>
    </div>
  );
};

export default Breadcrumbs;
