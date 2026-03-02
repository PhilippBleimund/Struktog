import "./assets/scss/structog.scss";

/**
 * Generate the Impressum page
 */
function generateImpressum() {
  document.title = "Impressum – Struktog";

  // Back link
  const back = document.createElement("a");
  back.href = "./index.html";
  back.textContent = "← Back";
  document.body.appendChild(back);

  // Page heading
  const h1 = document.createElement("h1");
  h1.textContent = "Impressum";
  document.body.appendChild(h1);

  function addSection(title, contentHTML) {
    const h2 = document.createElement("h2");
    h2.textContent = title;
    document.body.appendChild(h2);

    const div = document.createElement("div");
    div.innerHTML = contentHTML;
    document.body.appendChild(div);
  }

  addSection(
    "Angaben gemäß § 5 TMG",
    `
    <address>
      Philipp Bleimund<br>
      Horstkotterheide 35<br>
      33739 Bielefeld<br>
      Germany
    </address>
  `,
  );

  addSection(
    "Kontakt",
    `
    <p>E-Mail: <a href="mailto:webmaster@struktogramm.com">webmaster@struktogramm.com</a></p>
  `,
  );
}

generateImpressum();
