
class FileController
{
  subirArchivo = async (req, res, next) =>
  {
    const archivo = req.files.archivo;
    const fileName = archivo.name;
    const path = '/app/src/pdf/' + fileName;
    console.log(path)
    try {
      archivo.mv(path, (error) => {
        if (error) {
          console.error(error);
          res.writeHead(500, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ status: 'error', message: error }));
            return;
          }
          return res.status(200).send({ status: 'success', path: './' + fileName , filename: fileName});
       });
     } catch (e) {
       res.status(500).json({
         error: true,
         message: e.toString()
       });
     }
  }
}

module.exports = FileController;