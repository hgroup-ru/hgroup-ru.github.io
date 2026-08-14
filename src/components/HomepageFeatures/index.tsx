import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

interface FeatureItem {
  num: number;
  title: React.JSX.Element;
  iconName: string;
  description: React.JSX.Element;
  link: string;
}

// eslint-disable-next-line complete/require-capital-const-assertions, complete/require-capital-read-only
const FeatureList: FeatureItem[] = [
  {
    num: 1,
    title: (
      <Translate id="homepage.feature.beginner.title">
        Beginner&apos;s Guide
      </Translate>
    ),
    iconName: "baby",
    description: (
      <Translate id="homepage.feature.beginner.description">
        Start here to learn the fundamentals.
      </Translate>
    ),
    link: "beginner",
  },
  {
    num: 2,
    title: (
      <Translate id="homepage.feature.learning.title">Learning Path</Translate>
    ),
    iconName: "school",
    description: (
      <Translate id="homepage.feature.learning.description">
        Learn our strategies gradually, level by level.
      </Translate>
    ),
    link: "learning-path",
  },
  {
    num: 3,
    title: (
      <Translate id="homepage.feature.reference.title">
        Reference Document
      </Translate>
    ),
    iconName: "list-ul",
    description: (
      <Translate id="homepage.feature.reference.description">
        Look up something specific.
      </Translate>
    ),
    link: "reference",
  },
];

function Feature({ num, title, iconName, description, link }: FeatureItem) {
  return (
    <div className={`col col--4 ${styles["feature"]}`}>
      <div className="text--center">
        <br />
        <a href={useBaseUrl(link)}>
          <span className="fa-stack fa-3x">
            <div
              className={`fa fa-circle fa-stack-2x ${styles[`circle-accent${num}`]}`}
            ></div>
            <div className={`fa fa-${iconName} fa-stack-1x fa-inverse`}></div>
          </span>
        </a>
        <br />
        <br />
      </div>
      <h3 className="text--center">
        <a href={useBaseUrl(link)}>{title}</a>
      </h3>
      <p className="text--center">{description}</p>
    </div>
  );
}

export default function HomepageFeatures(): React.JSX.Element {
  return (
    <section className={styles["features"]}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
