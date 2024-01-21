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

documentLoader();
statsLoader();


function selectHand(event) {
  var visible_mary = document.getElementsByClassName("#MWS");
  var visible_percy = document.getElementsByClassName("#PBS");

  var maryArray = Array.from(visible_mary);
  var percyArray = Array.from(visible_percy);

  if (event.target.value == 'reading') {
    displayReadingText();
  } else {
    resetToOriginal(maryArray, percyArray);

    if (event.target.value == 'both') {
      showBoth(maryArray, percyArray);
    } else if (event.target.value == 'Mary') {
      showMary(maryArray, percyArray);
    } else {
      showPercy(maryArray, percyArray);
    }
  }
}

function showBoth(maryArray, percyArray) {
  maryArray.forEach(function (element) {
    element.style.color = 'black';
  });

  percyArray.forEach(function (element) {
    element.style.color = 'black';
  });
}

function showMary(maryArray, percyArray) {
  maryArray.forEach(function (element) {
    element.style.color = 'red';
  });

  percyArray.forEach(function (element) {
    element.style.color = 'lightgrey';
  });
}

function showPercy(maryArray, percyArray) {
  percyArray.forEach(function (element) {
    element.style.color = 'red';
  });

  maryArray.forEach(function (element) {
    element.style.color = 'lightgrey';
  });
}

function toggleDeletions(event) {
  var deletions = document.getElementsByTagName("del");
  let showDeletions = event.target.checked;
  for (let deletion of deletions) {
    deletion.style.color = showDeletions ? 'red' : 'black';
  }
}

function displayReadingText() {
  var deletions = document.getElementsByTagName("del");
  var additions = document.getElementsByTagName("ins");

  
  for (let deletion of deletions) {
    deletion.style.display = 'none';
  }

  
  for (let addition of additions) {
    addition.style.textDecoration = 'none'; 
    addition.style.display = 'inline';
  }
}

function resetToOriginal(maryArray, percyArray) {
  var deletions = document.getElementsByTagName("del");
  var additions = document.getElementsByTagName("ins");

  
  for (let deletion of deletions) {
    deletion.style.display = 'inline'; 
  }

  
  for (let addition of additions) {
    addition.style.textDecoration = 'none';
  }

  
  maryArray.forEach(function (element) {
    element.style.color = 'black';
  });

  percyArray.forEach(function (element) {
    element.style.color = 'black';
  });
}

document.getElementById("prevBtn").addEventListener("click", function () {
  navigatePage(-1);
});

document.getElementById("nextBtn").addEventListener('click', function () {
  navigatePage(1);
});


function navigatePage(direction) {
  let currentPage = getCurrentPageNumber();
  let currentIndex = pageNumbers.indexOf(currentPage);
  let newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < pageNumbers.length) {
    let newPage = pageNumbers[newIndex];
    let newUrl = updateQueryStringParameter(window.location.href, 'page', newPage);
    window.location.href = newUrl;
  }
}

function getCurrentPageNumber() {
  let urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('page');
}

function updateQueryStringParameter(uri, key, value) {
  let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  let separator = uri.indexOf('?') !== -1 ? "&" : "?";

  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  } else {
    return uri + separator + key + "=" + value;
  }
}

const pageNumbers = ["21r", "21v", "22r", "22v", "23r", "23v", "24r", "24v", "25r", "25v"];



var isRed = false;

function toggleDel() {
  var delElements = document.querySelectorAll('del');
  
  delElements.forEach(function(delElement) {
    if (isRed) {
      // If currently red, set color to default (black)
      delElement.style.color = 'black';
    } else {
      // If not red, set color to red
      delElement.style.color = 'red';
    }
  });

  // Toggle the state
  isRed = !isRed;
}
