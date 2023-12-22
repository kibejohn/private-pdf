import * as pdfjsLib from 'pdfjs-dist';
import { degrees, PDFDocument, rgb, StandardFonts, PDFField, PDFFont, PDFImage, PDFForm } from 'pdf-lib';

import { PdfDocument } from './PdfDocument';
import { FormInputValues } from './FormInputValues';
import { Overlays } from './overlays/Overlays';
import { ImageType } from './overlays/ImageOverlay';

export class PdfDocumentSaver {
  constructor() {}

  public async applyChangesAndSave(originalPdfBytes: Uint8Array, formInputValues: FormInputValues, overlays: Overlays): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(originalPdfBytes)

    this.populateFormValues(formInputValues, pdfDoc.getForm());

    // TODO: font color
    // TODO: validation
    // TODO: zooming
    // TODO: rotation
    // TODO: use Bootstrap for styling
    // TODO: refactor

    // Fonts
    const neededFonts: Map<string, PDFFont> = await this.getNeededFonts(overlays, pdfDoc);

    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (const [pageNumber, pageOverlays] of overlays.pagesOverlays) {
        const page = pdfDoc.getPage(pageNumber-1); // in pdflib pages are 0-based
        
        for (const textOverlay of pageOverlays.textOverlays) {
            console.log(`antoan saving page ${pageNumber}, y is ${textOverlay.transform.y}`)
            page.drawText(textOverlay.text, {
                x: textOverlay.transform.x,
                y: textOverlay.transform.y,
                size: textOverlay.textSize,
                font: neededFonts.get(textOverlay.fontFamily) || helveticaFont,
                color: rgb(
                    textOverlay.textColor.red, 
                    textOverlay.textColor.green,
                    textOverlay.textColor.blue),
            })
        }

        for (const imageOverlay of pageOverlays.imageOverlays) {
            const pdfImage = 
                imageOverlay.imageType == ImageType.PNG ? await pdfDoc.embedPng(imageOverlay.base64)
                : imageOverlay.imageType == ImageType.JPEG ? await pdfDoc.embedJpg(imageOverlay.base64) 
                : null;
            if (pdfImage == null) {
                console.log(`Error reading pdfPage - invalid image format. ${imageOverlay}`)
                continue;
            }
            page.drawImage(pdfImage, {
                x: imageOverlay.transform.x,
                y: imageOverlay.transform.y,
                width: imageOverlay.width,
                height: imageOverlay.height,
                rotate: degrees(imageOverlay.transform.rotation),
                opacity: 1,
              })
        }
    }

    return pdfDoc.save()
  }

    private populateFormValues(formInputValues: FormInputValues, form: PDFForm) {
        for (const [key, value] of formInputValues.textNameToValue) {
            form.getTextField(key).setText(value);
        }

        for (const [key, value] of formInputValues.checkboxNameToValue) {
            if (value) {
                form.getCheckBox(key).check();
            } else {
                form.getCheckBox(key).uncheck();
            }
        }

        for (const [key, value] of formInputValues.dropdownNameToSelectedIndex) {
            const dropdown = form.getDropdown(key);
            const options = dropdown.getOptions();
            if (value < 0 || value >= options.length) {
                continue;
            }
            dropdown.select(options[value]);
        }
        
        for (const [key, value] of formInputValues.optionNameToSelectedIndex) {
            const optionsList = form.getOptionList(key);
            const options = optionsList.getOptions();
            if (value < 0 || value >= options.length) {
                continue;
            }
            console.log("antoan option selected = " + options[value] + " " + value)
            optionsList.select(options[value]);
            console.log("antoan option selected getSelected() = " + optionsList.getSelected())

        }

        for (const [key, value] of formInputValues.radioGroupNameToSelectedIndex) {
            const radioGroup = form.getRadioGroup(key);
            const options = radioGroup.getOptions();
            console.log("antoan radio options are " + options);
            if (value < 0 || value >= options.length) {
                continue;
            }
            radioGroup.select(options[value]);
        }
    }

  private async getNeededFonts(overlays: Overlays, pdfDoc: PDFDocument) {
    const fontValues: string[] = Object.values(StandardFonts);
    const neededFonts: Map<string, PDFFont> = new Map();
    for (const pageOverlays of overlays.pagesOverlays.values()) {
        for (const textOverlay of pageOverlays.textOverlays) {
            if (fontValues.indexOf(textOverlay.fontFamily) != -1
                && !neededFonts.has(textOverlay.fontFamily)) {
                const pdfFont = await pdfDoc.embedFont(textOverlay.fontFamily);
                neededFonts.set(textOverlay.fontFamily, pdfFont);
            }
        }
    }
    return neededFonts;
}
}