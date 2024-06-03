
using System;
using System.Collections.Generic;

namespace Models
{
    public class ApplicationUserDTO
    {
        public string Role { get; set; }
        public string Establishment { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public DateTime SubscriptionDate { get; set; }

        public string Name { get; set; }
        public string Phone { get; set; }
        public string Cpf { get; set; }

    }
}
