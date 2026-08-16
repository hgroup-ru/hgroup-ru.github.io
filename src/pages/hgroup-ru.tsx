import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import Translate, { translate } from "@docusaurus/Translate";
import Layout from "@theme/Layout";

export default function HGroupRuPage(): React.JSX.Element {
  const title = translate({
    message: "About the Russian version",
    id: "hgroupRu.title",
  });

  return (
    <Layout>
      <Head>
        <title>{`${title} | H-Group Conventions`}</title>
      </Head>
      <main className="container margin-vert--lg">
        <article className="theme-doc-markdown markdown">
          <h1>
            <Translate id="hgroupRu.title">About the Russian version</Translate>
          </h1>

          <p>
            <Translate id="hgroupRu.lead">
              H-Group RU maintains the Russian localization of H-Group
              Conventions.
            </Translate>
          </p>

          <h2>
            <Translate id="hgroupRu.what.title">What this site is</Translate>
          </h2>

          <p>
            <Translate id="hgroupRu.what.body1">
              This site publishes Russian translations of H-Group Conventions
              materials: the Beginner's Guide, levels, reference material, and
              related pages.
            </Translate>
          </p>

          <p>
            <Translate id="hgroupRu.what.body2">
              The original H-Group project remains the source for the meaning of
              the conventions. The Russian version does not define a separate
              convention system.
            </Translate>
          </p>

          <h2>
            <Translate id="hgroupRu.who.title">Who H-Group RU is</Translate>
          </h2>

          <p>
            <Translate id="hgroupRu.who.body1">
              H-Group RU is the localization project that maintains the Russian
              text, terminology, synchronization with the original project, and
              publication of this site.
            </Translate>
          </p>

          <p>
            <Translate id="hgroupRu.who.body2">
              We are not the authors of the original H-Group convention system
              and do not speak on behalf of H-Group.
            </Translate>
          </p>

          <h2>
            <Translate id="hgroupRu.local.title">Local additions</Translate>
          </h2>

          <p>
            <Translate id="hgroupRu.local.body">
              When the Russian project adds its own supporting material, such as
              Training content, it is labeled as local and is not presented as
              original H-Group material.
            </Translate>
          </p>

          <h2>
            <Translate id="hgroupRu.sources.title">
              Sources and contributions
            </Translate>
          </h2>

          <ul>
            <li>
              <a href="https://hanabi.github.io/">
                <Translate id="hgroupRu.sources.originalSite">
                  Original H-Group website
                </Translate>
              </a>
            </li>
            <li>
              <a href="https://github.com/hanabi/hanabi.github.io">
                <Translate id="hgroupRu.sources.originalRepo">
                  Original source repository
                </Translate>
              </a>
            </li>
            <li>
              <a href="https://github.com/hgroup-ru/hgroup-ru.github.io">
                <Translate id="hgroupRu.sources.russianRepo">
                  Russian localization repository
                </Translate>
              </a>
            </li>
          </ul>

          <p>
            <Translate id="hgroupRu.contribute">
              Changes to Russian translation, terminology, or the Russian site
              belong in H-Group RU. Changes to the original English text or
              H-Group semantics should be proposed to the original project
              first.
            </Translate>
          </p>

          <p>
            <Translate id="hgroupRu.aboutOriginal.prefix">The page</Translate>{" "}
            <Link to="/about">
              <Translate id="hgroupRu.aboutOriginal.link">
                About the project
              </Translate>
            </Link>{" "}
            <Translate id="hgroupRu.aboutOriginal.suffix">
              is a translation of the original H-Group About page and describes
              the original group, not H-Group RU.
            </Translate>
          </p>
        </article>
      </main>
    </Layout>
  );
}
