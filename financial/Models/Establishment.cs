using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Models
{
    [Table("Establishment")]
    public class Establishment : BaseEntity
    {
        public string ImageName { get; set; }
        public string Logo { get; set; }
        public string Name { get; set; }
        public string ContactName { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string PostalCode { get; set; }
        public string AccessTokenMercadoPago { get; set; }
        public string Cnpj { get; set; }
        public bool Active { get; set; }
        public int ModuleId { get; set; }
        public string ApplicationUserId { get; set; }

        public bool? PaymentOnLine { get; set; }
        public bool? PaymentLittleMachine { get; set; }
        public bool? PaymentMoney { get; set; }
        public bool? InstorePickup { get; set; }
        public bool? Delivery { get; set; }
        public decimal? MinimumValue { get; set; }

        [NotMapped]
        public virtual IQueryable<Subscription> Subscriptions { get; set; }

        [NotMapped]
        public virtual ApplicationUserDTO ApplicationUserDTO { get; set; }

        [NotMapped]
        public virtual ApplicationUser ApplicationUser { get; set; }

        [NotMapped]
        public virtual string Base64 { get; set; }

        [NotMapped]
        public virtual Module Module { get; set; }

        [NotMapped]
        public virtual string Email { get; set; }

        [NotMapped]
        public virtual List<OpeningHours> OpeningHours { get; set; }
    }
}