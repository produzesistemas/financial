using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("Log")]

    public class Log : BaseEntity
    {
        public string Description { get; set; }
        public string ApplicationUserId { get; set; }
        public int Type { get; set; }
        public DateTime CreateDate { get; set; }

        [NotMapped]
        public virtual ApplicationUser ApplicationUser { get; set; }
        [NotMapped]
        public virtual string Name { get; set; }
    }
}
