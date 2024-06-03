
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("Coupon")]
    public class Coupon : BaseEntity
    {
        public string Code { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
        public bool General { get; set; }
        public bool? Main { get; set; }
        public bool Type { get; set; }
        public int Quantity { get; set; }
        public decimal Value { get; set; }
        public decimal MinimumValue { get; set; }
        public DateTime InitialDate { get; set; }
        public DateTime FinalDate { get; set; }
        public int EstablishmentId { get; set; }

        public string UpdateApplicationUserId { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string AspNetUsersId { get; set; }
        public string ClientId { get; set; }

    }
}
