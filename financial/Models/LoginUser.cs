
using System.Collections.Generic;

namespace Models
{
    public class LoginUser
    {
        public string Email { get; set; }
        public string Secret { get; set; }
        public string UserName { get; set; }
        public string Phone { get; set; }
        public string Name { get; set; }
        public Module Module { get; set; }
        public string ApplicationUserId { get; set; }
        public string Code { get; set; }
        public int? EstablishmentId { get; set; }
        public string Cpf { get; set; }

    }
}
