using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
namespace Models
{
    [Table("Category")]

    public class Category : BaseEntity
    {
		public string ImageName { get; set; }
		public string Description { get; set; }
        public int EstablishmentId { get; set; }
        public string ApplicationUserId { get; set; }
        public bool Active { get; set; } = true;

    }
}
