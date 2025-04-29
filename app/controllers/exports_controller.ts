import type { HttpContext } from '@adonisjs/core/http';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Buffer } from 'buffer';

// Define la estructura esperada del JSON para los elementos
interface UserRequest {
  id: number;
  userName: string;
  userPhone: string;
  userStreet: string;
  userNeighborhood: string;
  userLocationName: string;
  wasteTypeName: string;
  requestTypeName: string;
  requestStatusName: string;
  scheduleDate: string;
}

export default class ExportController {
  public async exportExcel({ request, response }: HttpContext) {
    // Aplica type assertion después de validar que es un array
    const jsonData = request.body() as unknown as UserRequest[];
    
    // Crear un nuevo documento PDF con orientación horizontal para más espacio
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([842, 595]); // A4 horizontal (595x842)
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 10;
    // const headerFontSize = 12;
    
    // Título del documento
    page.drawText('Reporte de Solicitudes', {
      x: width / 2 - 80,
      y: height - 50,
      font: boldFont,
      size: 16
    });
    
    // Fecha actual
    const currentDate = new Date().toLocaleDateString('es-ES');
    page.drawText(`Fecha de generación: ${currentDate}`, {
      x: width - 200,
      y: height - 50,
      font,
      size: fontSize
    });
    
    // Definir posiciones para la tabla
    const margin = 50;
    const startY = height - 80;
    let yPosition = startY;
    
    // Ancho de las columnas
    const colWidths = {
      id: 30,
      name: 90,
      phone: 70,
      street: 90,
      neighborhood: 70,
      location: 70,
      wasteType: 90,
      requestType: 70,
      status: 70,
      date: 90
    };
    
    // Encabezados de la tabla
    const drawTableHeader = () => {
      // Fondo del encabezado
      page.drawRectangle({
        x: margin,
        y: yPosition - 20,
        width: width - (margin * 2),
        height: 20,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      
      let xPosition = margin + 5;
      
      // Texto de los encabezados
      page.drawText('ID', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.id;
      
      page.drawText('Nombre', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.name;
      
      page.drawText('Teléfono', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.phone;
      
      page.drawText('Calle', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.street;
      
      page.drawText('Barrio', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.neighborhood;
      
      page.drawText('Ubicación', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.location;
      
      page.drawText('Residuos', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.wasteType;
      
      page.drawText('Solicitud', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.requestType;
      
      page.drawText('Estado', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      xPosition += colWidths.status;
      
      page.drawText('Fecha Prog.', { x: xPosition, y: yPosition - 15, font: boldFont, size: fontSize });
      
      yPosition -= 20;
    };
    
    // Dibujar encabezados
    drawTableHeader();
    
    // Iterar sobre los datos para crear filas en la tabla
    jsonData.forEach((item, index) => {
      // Alternar color de fondo para las filas
      const rowColor = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.95, 0.95, 0.95);
      
      // Dibujar fondo de la fila
      page.drawRectangle({
        x: margin,
        y: yPosition - 20,
        width: width - (margin * 2),
        height: 20,
        color: rowColor,
        borderColor: rgb(0.8, 0.8, 0.8),
        borderWidth: 0.5,
      });
      
      // Formatear fecha
      const dateObj = new Date(item.scheduleDate);
      const formattedDate = dateObj.toLocaleDateString('es-ES') + ' ' + 
                            dateObj.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
      
      // Dibujar datos de la fila
      let xPosition = margin + 5;
      
      page.drawText(item.id.toString(), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.id;
      
      page.drawText(truncateText(item.userName, 12), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.name;
      
      page.drawText(item.userPhone, { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.phone;
      
      page.drawText(truncateText(item.userStreet, 12), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.street;
      
      page.drawText(truncateText(item.userNeighborhood, 10), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.neighborhood;
      
      page.drawText(truncateText(item.userLocationName, 10), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.location;
      
      page.drawText(truncateText(item.wasteTypeName, 12), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.wasteType;
      
      page.drawText(truncateText(item.requestTypeName, 10), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.requestType;
      
      page.drawText(truncateText(item.requestStatusName, 10), { x: xPosition, y: yPosition - 15, font, size: fontSize });
      xPosition += colWidths.status;
      
      page.drawText(formattedDate, { x: xPosition, y: yPosition - 15, font, size: fontSize });
      
      yPosition -= 20;
      
      // Si llegamos al final de la página, añadir una nueva página
      if (yPosition < margin + 20) {
        page = pdfDoc.addPage([842, 595]);
        yPosition = startY;
        drawTableHeader();
      }
    });
    
    // Dibujar borde inferior de la tabla
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    
    // Pie de página
    page.drawText(`Total de registros: ${jsonData.length}`, {
      x: margin,
      y: margin / 2,
      font: boldFont,
      size: fontSize
    });
    
    // Serializa el PDF a bytes
    const pdfBytes = await pdfDoc.save();
    
    // Convierte los bytes del PDF a base64
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    
    // Devuelve el PDF en base64 como respuesta
    response.json({ pdfBase64 });
  }
}

// Función auxiliar para truncar texto largo
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}