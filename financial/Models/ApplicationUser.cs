using Microsoft.AspNetCore.Identity;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    public class ApplicationUser : IdentityUser
    {
        [NotMapped]
        public string Token { get; set; }

        [NotMapped]
        public string Role { get; set; }

        public string Name { get; set; }
        public string Provider { get; set; }
        public string Cpf {  get; set; }
        //[NotMapped]
        //public Establishment Establishment { get; set; }

        //public virtual ICollection<ApplicationUserClaim> Claims { get; set; }

        public static explicit operator ApplicationUser(string v)
        {
            throw new NotImplementedException();
        }

        public ApplicationUser()
        {
        }

        //public class ApplicationUserClaim : IdentityUserClaim<string>
        //{
        //    public virtual ApplicationUser User { get; set; }
        //}
    }
}