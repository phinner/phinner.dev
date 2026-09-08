import { type Content, useLanguage } from "../components/LanguageProvider";

export function DeepDive() {
  const { language } = useLanguage();
  const content = {
    get en() {
      return (
        <>
          <h2>The job</h2>
          <p>
            RTeam is a small repair business in Namur, Belgium. The owner handled their repairs with
            Google Forms and spreadsheets. But as they scaled, they wanted a dedicated platform and
            a better online presence.
          </p>
          <p>
            I worked with them to create the initial public website, until they were satisfied with
            the visuals. Then I worked on the repair request flows.
          </p>
          <p>
            Customers can request repairs through a form on the website. For email and phone, a
            technician fills in the form.
          </p>
          <p>
            I'm enjoying the work and learning a lot about React Router and the Belgian and European
            legal requirements for websites.
          </p>
          <p>
            As of early September 2026, I'm refining the public site and finishing the sales
            feature. Listings for refurbished items and spare parts will appear on the site and be
            published on Facebook automatically.
          </p>
        </>
      );
    },
    get fr() {
      return (
        <>
          <h2>Le travail</h2>
          <p>
            RTeam est une petite entreprise de réparation à Namur, en Belgique. Le propriétaire
            suivait les réparations avec Google Forms et des feuilles de calcul. Avec la croissance
            de l'activité, il voulait un outil dédié et une meilleure présence en ligne.
          </p>
          <p>
            J'ai d'abord travaillé avec lui sur le site public jusqu'à ce que le résultat lui
            plaise. Ensuite, je me suis occupé des demandes de réparation.
          </p>
          <p>
            Les clients peuvent demander une réparation par formulaire sur le site. Pour les
            demandes par e-mail ou téléphone, un technicien remplit le formulaire.
          </p>
          <p>
            Le travail me plaît beaucoup et j'apprends pas mal de choses sur React Router et les
            obligations légales belges et européennes pour les sites web.
          </p>
          <p>
            Début septembre 2026, je peaufine le site public et termine la partie vente. Les
            annonces d'appareils reconditionnés et de pièces détachées apparaîtront sur le site et
            seront publiées automatiquement sur Facebook.
          </p>
        </>
      );
    },
  } satisfies Content;

  return <>{content[language()]}</>;
}
