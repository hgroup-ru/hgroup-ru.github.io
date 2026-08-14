import Link from "@docusaurus/Link";
import Translate from "@docusaurus/Translate";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "../components/HomepageFeatures";
import styles from "./styles.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={`hero hero--primary ${styles["heroBanner"]}`}>
      <div className="container">
        <img src={useBaseUrl("img/logo.png")} width="200em" />
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          <Translate id="homepage.hero.prefix">Strategies for</Translate>{" "}
          <a
            href="https://boardgamegeek.com/boardgame/98778/hanabi"
            id="landing-page-hanabi-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            Hanabi
          </a>
          <Translate id="homepage.hero.suffix">
            {", a cooperative card game of logic and reasoning."}
          </Translate>
        </p>
        <div className={styles["buttons"]}>
          <Link
            className={`button button--outline button--secondary button--lg ${styles["getStarted"]}`}
            to={useBaseUrl("about")}
          >
            <Translate id="homepage.learnMore">Learn More</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function LocalizationNotice() {
  return (
    <section className={styles["localizationSection"]}>
      <div className="container">
        <div className={`alert alert--info ${styles["localizationNotice"]}`}>
          <div className={styles["localizationCopy"]}>
            <div className={styles["localizationEyebrow"]}>
              <Translate id="homepage.localization.eyebrow">
                Russian version
              </Translate>
            </div>

            <strong className={styles["localizationTitle"]}>
              <Translate id="homepage.localization.title">
                Russian localization of H-Group Conventions
              </Translate>
            </strong>

            <p className={styles["localizationText"]}>
              <Translate id="homepage.localization.body">
                This site is maintained by H-Group RU as a Russian localization
                of H-Group materials. The conventions themselves and their
                meaning come from the original H-Group project.
              </Translate>
            </p>
          </div>

          <Link
            className={`button button--secondary button--sm ${styles["localizationAction"]}`}
            to={useBaseUrl("hgroup-ru")}
          >
            <Translate id="homepage.localization.link">
              About the Russian version
            </Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Home(): React.JSX.Element {
  return (
    <Layout>
      <HomepageHeader />
      <main>
        <LocalizationNotice />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}

export default Home;
