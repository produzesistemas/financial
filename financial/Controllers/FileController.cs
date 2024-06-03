using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Models;
using System.IO;

namespace financial.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private IWebHostEnvironment _hostEnvironment;
        private IConfiguration _configuration;

        public FileController(IWebHostEnvironment environment, IConfiguration configuration)
        {
            this._hostEnvironment = environment;
            _configuration = configuration;
        }

        [HttpPost]
        [Route("download")]
        public void Download(FileParamDto param)
        {
            if (param != null && param.fileName != null)
            {
                var fileName = Path.GetFileName(param.fileName);

                var uploads = Path.Combine(_hostEnvironment.ContentRootPath, _configuration["pathFileDocument"]);
                var path = Path.Combine(uploads, param.fileName);

                var pathToSave = string.Concat(_hostEnvironment.ContentRootPath, _configuration["pathFileDocument"], param.fileName);

                FileInfo fi = new FileInfo(pathToSave);
                if (fi.Exists)
                {
                    Response.Headers.Add("content-disposition", "attachment;  filename=" + fileName.Replace(",", ""));
                    new FileExtensionContentTypeProvider().TryGetContentType(fileName, out string contentType);
                    Response.ContentType = contentType ?? "application /octet-stream";
                    byte[] file = System.IO.File.ReadAllBytes(pathToSave);
                    Response.Body.WriteAsync(file, 0, file.Length);
                }
            }
        }
    }
}