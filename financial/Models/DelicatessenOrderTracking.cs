using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("DelicatessenOrderTracking")]
    public class DelicatessenOrderTracking : BaseEntity
    {
        public System.DateTime FollowupDate { get; set; }
        public int DelicatessenOrderId { get; set; }
        public int StatusOrderId { get; set; }

        [NotMapped]
        public virtual StatusOrder StatusOrder { get; set; }
        [NotMapped]
        public virtual DelicatessenOrder DelicatessenOrder { get; set; }

    }
}
