import express from "express";
import multer from "multer";
import fs from "fs";
import { PDFDocument } from "pdf-lib";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.post("/upload", upload.single("pdf"), async (req, res) => {
    console.log("here");
    // console.log(req.body.pages); //array of pages needed
    const pages = [1, 2, 3, 4].map((e) => parseInt(e));
    const pdfFile = await PDFDocument.load(req.file.buffer);
    const pdfDoc = await PDFDocument.create();
    const copiedPages = await pdfDoc.copyPages(pdfFile, pages);
    copiedPages.forEach((e) => {
        pdfDoc.addPage(e);
    });
    const pdfBytes = await pdfDoc.save();
    fs.writeFile("test.pdf", pdfBytes, function (err) {
        if (err) throw err;
        console.log("Replaced!");
    });
    res.json("file edited and saved");
});

app.listen(3000, () => {
    console.log("server running");
});
