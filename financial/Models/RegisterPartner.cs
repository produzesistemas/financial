
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Models
{
    public class RegisterPartner
    {
        public string Email { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public string ContactName { get; set; }
        public string Code { get; set; }
        public string Base64 { get; set; }
        public string Address { get; set; }
        public string Cnpj { get; set; }
        public string Phone { get; set; }
        public string PostalCode { get; set; }
        public Module Module { get; set; }
    }
}
