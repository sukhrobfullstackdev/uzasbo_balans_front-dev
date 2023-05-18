function getX500Val(s, f) {
  var res = s.splitKeep(/,[A-Z]+=/g, true);
  for (var i in res) {
    var n = res[i].search(f + "=");
    if (n !== -1) {
      return res[i].slice(n + f.length + 1);
    }
  }
  return "";
};

function listCertKeyCertificates(items, allDisks, diskIndex, callback) {
  if (parseInt(diskIndex) + 1 > allDisks.length) {
    callback();
    return;
  }
  window.CAPIWS.callFunction({
    plugin: "certkey",
    name: "list_certificates",
    arguments: [allDisks[diskIndex]]
  }, (event, data) => {
    if (data.success) {
      for (var rec in data.certificates) {
        var el = data.certificates[rec];
        var x500name_ex = el.subjectName.toUpperCase();
        x500name_ex = x500name_ex.replace("1.2.860.3.16.1.1=", "INN=");
        x500name_ex = x500name_ex.replace("1.2.860.3.16.1.2=", "PINFL=");
        var vo = {
          disk: el.disk,
          path: el.path,
          name: el.name,
          serialNumber: el.serialNumber,
          subjectName: el.subjectName,
          validFrom: new Date(el.validFrom),
          validTo: new Date(el.validTo),
          issuerName: el.issuerName,
          publicKeyAlgName: el.publicKeyAlgName,
          CN: getX500Val(x500name_ex, "CN"),
          TIN: (getX500Val(x500name_ex, "INITIALS") ? getX500Val(x500name_ex, "INITIALS") : (getX500Val(
            x500name_ex, "INN") ? getX500Val(x500name_ex, "INN") : getX500Val(x500name_ex, "UID"))),
          UID: getX500Val(x500name_ex, "UID"),
          O: getX500Val(x500name_ex, "O"),
          T: getX500Val(x500name_ex, "T"),
          type: 'certkey'
        };
        items.push(vo);
      }
      listCertKeyCertificates(items, allDisks, parseInt(diskIndex) + 1, callback);
    } else {
      alert(data.reason);
    }
  }, function (e) {
    alert(e);
  });
}

function fillCertKeys(items, callback) {
  var allDisks = [];
  window.CAPIWS.callFunction({
    plugin: "certkey",
    name: "list_disks"
  }, (event, data) => {
    if (data.success) {
      for (var rec in data.disks) {
        allDisks.push(data.disks[rec]);
        if (parseInt(rec) + 1 >= data.disks.length) {
          listCertKeyCertificates(items, allDisks, 0, () => {
            callback();
          });
        }
      }
    } else {
      alert(data.reason);
    }
  }, function (e) {
    alert(e);
  });
};

function listPfxCertificates(items, allDisks, diskIndex, callback) {
  if (parseInt(diskIndex) + 1 > allDisks.length) {
    callback();
    return;
  }
  window.CAPIWS.callFunction({
    plugin: "pfx",
    name: "list_certificates",
    arguments: [allDisks[diskIndex]]
  }, (event, data) => {
    if (data.success) {
      for (var rec in data.certificates) {
        var el = data.certificates[rec];
        var x500name_ex = el.alias.toUpperCase();
        x500name_ex = x500name_ex.replace("1.2.860.3.16.1.1=", "INN=");
        x500name_ex = x500name_ex.replace("1.2.860.3.16.1.2=", "PINFL=");
        var vo = {
          disk: el.disk,
          path: el.path,
          name: el.name,
          alias: el.alias,
          serialNumber: getX500Val(x500name_ex, "SERIALNUMBER"),
          validFrom: new Date(getX500Val(x500name_ex, "VALIDFROM").replace(/\./g, "-")),
          validTo: new Date(getX500Val(x500name_ex, "VALIDTO").replace(/\./g, "-")),
          CN: getX500Val(x500name_ex, "CN"),
          TIN: (getX500Val(x500name_ex, "INN") ? getX500Val(x500name_ex, "INN") : getX500Val(x500name_ex,
            "UID")),
          UID: getX500Val(x500name_ex, "UID"),
          O: getX500Val(x500name_ex, "O"),
          T: getX500Val(x500name_ex, "T"),
          type: 'pfx'
        };
        items.push(vo);
      }
      listPfxCertificates(items, allDisks, parseInt(diskIndex) + 1, callback);
    } else {
      alert(data.reason);
    }
  }, function (e) {
    alert(e);
  });
};

function fillPfxs(items, callback) {
  var allDisks = [];
  window.CAPIWS.callFunction({
    plugin: "pfx",
    name: "list_disks"
  }, (event, data) => {
    if (data.success) {
      var disks = data.disks;
      for (var rec in disks) {
        allDisks.push(data.disks[rec]);
        if (parseInt(rec) + 1 >= data.disks.length) {
          listPfxCertificates(items, allDisks, 0, () => {
            callback();
          });
        }
      }
    } else {
      alert(data.reason);
    }
  }, function (e) {
    alert(e);
  });
};

const apiKey = [
  'localhost',
  '96D0C1491615C82B9A54D9989779DF825B690748224C2B04F500F370D51827CE2644D8D4A82C18184D73AB8530BB8ED537269603F61DB0D03D2104ABF789970B',
  '127.0.0.1',
  'A7BCFA5D490B351BE0754130DF03A068F855DB4333D43921125B9CF2670EF6A40370C646B90401955E1F7BC9CDBF59CE0B2C5467D820BE189C845D0B79CFC96F',
  'null',
  'E0A205EC4E7B78BBB56AFF83A733A1BB9FD39D562E67978CC5E7D73B0951DB1954595A20672A63332535E13CC6EC1E1FC8857BB09E0855D7E76E411B6FA16E9D',
  'zp.uzasbo.uz',
  'AC26661C8ADFF6AC117D87EE5DFCBCF3AA7B753CE0845B582B10BF26E6A062CC13F0C9A963C245E0B86FE679943837B14FF3C7E52D01B9C04AA40F654DB8280A'
]

export { getX500Val, listCertKeyCertificates, fillCertKeys, listPfxCertificates, fillPfxs, apiKey }