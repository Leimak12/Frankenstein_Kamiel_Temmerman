// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
const searchParams = new URLSearchParams(window.location.search);

let tei_xml = searchParams.get('page');
document.getElementById("folio").innerHTML = tei_xml;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);


// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

// Initial document load
documentLoader();
statsLoader();



// Event listener for sel1 change
function selectHand(event) {
  var visible_mary = document.getElementsByClassName("#MWS");
  var visible_percy = document.getElementsByClassName("#PBS");

  // Convert the HTMLCollection to an array for forEach compatibility
  var maryArray = Array.from(visible_mary);
  var percyArray = Array.from(visible_percy);



  // Call the appropriate function based on the selected option
  if (event.target.value == 'both') {
    showBoth(maryArray, percyArray);
  } else if (event.target.value == 'Mary') {
    showMary(maryArray, percyArray);
  } else {
    showPercy(maryArray, percyArray);
  }
}

// Logic for 'both'
function showBoth(maryArray, percyArray) {
  maryArray.forEach(function (element) {
    element.style.color = 'black';
  });

  percyArray.forEach(function (element) {
    element.style.color = 'black';
  });
}

// Logic for 'Mary'
function showMary(maryArray, percyArray) {
  maryArray.forEach(function (element) {
    // Modify the style of the element for Mary (e.g., highlight in a different color)
    element.style.color = 'red'; // Change this to the desired style
  });

  percyArray.forEach(function (element) {
    // Modify the style of the element for Percy (in black)
    element.style.color = 'lightgrey';
    // You can add additional styling or visibility modifications as needed
  });
}

// Logic for 'Percy'
function showPercy(maryArray, percyArray) {
  percyArray.forEach(function (element) {
    // Modify the style of the element for Percy (e.g., highlight in a different color)
    element.style.color = 'red'; // Change this to the desired style
  });

  maryArray.forEach(function (element) {
    // Modify the style of the element for Mary (in red)
    element.style.color = 'lightgrey';
    // You can add additional styling or visibility modifications as needed
  });
}

// write another function that will toggle the display of the deletions by clicking on a button
function toggleDeletions(event) {
  var deletions = document.getElementsByTagName("del");
  let showDeletions = event.target.checked;
  for (let deletion of deletions) {
    deletion.style.color = showDeletions ? 'red' : 'black';
  }
}




