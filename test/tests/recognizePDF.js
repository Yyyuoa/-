describe("PDF Recognition", function() {
	Components.utils.import("resource://gre/modules/FileUtils.jsm");

	var win;
	before(function() {
		this.timeout(60000);
		return installPDFTools().then(function() {
			return loadZoteroPane();
		}).then(function(w) {
			win = w;
		});
	});
	after(function() {
		win.close();
	});

	it("should recognize a PDF with a DOI", function() {
		this.timeout(30000);
		// Import the PDF
		var testdir = getTestDataDirectory();
		testdir.append("recognizePDF_test_DOI.pdf");
		var id = Zotero.Attachments.importFromFile(testdir);

		// Recognize the PDF
		win.ZoteroPane.selectItem(id);
		win.Zotero_RecognizePDF.recognizeSelected();

		return waitForItemEvent("add").then(function(ids) {
			var item = Zotero.Items.get(ids[0]);
			assert.equal(item.getField("title"), "Shaping the Research Agenda");
			assert.equal(item.getField("libraryCatalog"), "CrossRef");
		});
	});
});