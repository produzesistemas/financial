using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Models
{
    [Table("DelicatessenOrder")]
    public class DelicatessenOrder : BaseEntity
    {
        public string ApplicationUserId { get; set; }
        public int? PaymentConditionId { get; set; }
        public int? AddressId { get; set; }
        public int? CouponId { get; set; }
        public DateTime RequestDate { get; set; }
        public decimal? TaxValue { get; set; }
        public int EstablishmentId { get; set; }
        public int? EstablishmentBrandCreditId { get; set; }
        public int? EstablishmentBrandDebitId { get; set; }
        public bool? InstorePickup { get; set; }
        public bool? Delivery { get; set; }
        public bool? PaymentOnLine { get; set; }
        public bool? PaymentLittleMachine { get; set; }
        public bool? PaymentMoney { get; set; }
        public decimal? ExchangeForCash { get; set; }

        [NotMapped]
        public virtual ApplicationUser ApplicationUser { get; set; }

        [NotMapped]
        public virtual ApplicationUserDTO ApplicationUserDTO { get; set; }

        [NotMapped]
        public virtual Address Address { get; set; }

        [NotMapped]
        public virtual Coupon Coupon { get; set; }
        [NotMapped]
        public virtual PaymentCondition PaymentCondition { get; set; }
        [NotMapped]
        public virtual EstablishmentBrandCredit EstablishmentBrandCredit { get; set; }
        [NotMapped]
        public virtual EstablishmentBrandDebit EstablishmentBrandDebit { get; set; }
        [NotMapped]
        public virtual DeliveryRegion DeliveryRegion { get; set; }

        [NotMapped]
        public virtual Establishment Establishment { get; set; }

        [NotMapped]
        public virtual string Code { get; set; }
        [NotMapped]
        public string Cpf { get; set; }

        [NotMapped]
        public string Name { get; set; }

        [NotMapped]
        public string PhoneNumber { get; set; }
        [NotMapped]
        public virtual string PostalCode { get; set; }
        [NotMapped]
        public virtual List<DelicatessenOrderProduct> DelicatessenOrderProducts { get; set; }
        [NotMapped]
        public virtual List<DelicatessenOrderEmail> DelicatessenOrderEmails { get; set; }
        [NotMapped]
        public virtual List<DelicatessenOrderTracking> DelicatessenOrderTrackings { get; set; }
        public DelicatessenOrder()
        {
            DelicatessenOrderProducts = new List<DelicatessenOrderProduct>();
            DelicatessenOrderEmails = new List<DelicatessenOrderEmail>();
            DelicatessenOrderTrackings = new List<DelicatessenOrderTracking>();
        }

        public decimal GetTotal()
        {
            decimal total = 0;
            this.DelicatessenOrderProducts.ForEach(delicatessenOrderProduct =>
            {
                total += delicatessenOrderProduct.Value * delicatessenOrderProduct.Quantity;
            });
            if (this.CouponId.HasValue)
            {
                if (this.Coupon.Type)
                {
                    total -= this.Coupon.Value;
                }
                else
                {
                    total -= (total * this.Coupon.Value) / 100;
                }
            }
            if (TaxValue.HasValue)
            {
                total += TaxValue.Value;
            }
            return Math.Round(total, 2);
        }
    }
}