const fs = require('fs')
const express = require('express')
const pdf = require('html-pdf')
const PDFDocument = require('pdfkit');
const bodyParser = require('body-parser');
const {v4: uuidV4} = require('uuid');
const cors = require('cors');
const path = require('path')

const PORT = 8080

const app = express()

app.use(cors())
app.use(bodyParser.json())

// app.get('/', (req, res) => {
//   var config = {
//     "header": {
//       "height": "45mm",
//       "contents": '<div style="text-align: center;">Author: Marc Bachmann</div>'
//     },
//     "footer": {
//       "height": "28mm",
//       "contents": {
//         first: 'Cover page',
//         2: 'Second page', // Any page number is working. 1-based index
//         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
//         last: 'Last Page'
//       }
//     }
//   }
//   var html = fs.readFileSync('./test.html', 'utf-8');

//   pdf.create(html, config)
//     .toFile('./test.pdf', function(err, response) {
//       if(err) return console.log(err);
//       res.json(response)
//     })
// })

app.post('/pdf', (req, res) => {
 
  // Create a document
  const payload = req.body;
  const doc = new PDFDocument();
  const pdfID = uuidV4();

  doc.pipe(fs.createWriteStream(path.join(__dirname, 'pdfs', pdfID+'.pdf')));


  for (let student of payload.students) {
    const generateSubjects = (() => {
      const randomNumber = () => Math.floor(Math.random() * (90 - 70)) + 70;
      
      return {
        'Mathematics': randomNumber(),
        'English': randomNumber(),
        "Basic-Science": randomNumber(),
        "Physics": randomNumber(),
        "Chemistry": randomNumber(),
        "Civic Education": randomNumber(),
        "F.Mathematics": randomNumber(),
        "Biology": randomNumber(),
        "Data Processing": randomNumber(),
        "Government": randomNumber(),
        "Agric Science": randomNumber(),
        "Book-Keeping": randomNumber(),
        "Economics": randomNumber(),
        "Commerce": randomNumber(),
        "CRS": randomNumber(),
        "Marketing": randomNumber(),
        "Geography": randomNumber(),
        "Lit-In-English": randomNumber()
      }
    })()

    doc
      .addPage()
      .text(`First Name: ${student.first_name},   MiddleName: ${student.middle_name},   Last Name: ${student.last_name}`)
      .moveDown()
      .text(`Date of Birth: ${student.dob}`)
      .text(`Gender: ${student.gender}`)
      .text('Subjects', {
        wordSpacing: 140
      })

      for (let key of Object.keys(generateSubjects)) {
        doc
          .text(`${key}  ----->  ${generateSubjects[key]}`, {
            columns: 2,
            columnGap: 50,
          })
      }

  }

  doc.end()

  res.json({
    url: `/get-pdf/${pdfID}.pdf`
  })

})

app.get('/get-pdf/:id', (req, res) => {
  const id = req.params.id
  console.log(id)

  res.sendFile(path.resolve(__dirname, 'pdfs', id))
})

app.listen(PORT, ()=>console.log('server started on ', PORT))