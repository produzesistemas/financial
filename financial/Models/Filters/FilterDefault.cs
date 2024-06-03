using System;

namespace Models.Filters
{
    public class FilterDefault
    {
        public string Search { get; set; }
        public int Id { get; set; }
        public int? Type { get; set; }
        public DateTime? CreateDate { get; set; }
        public int SizePage { get; set; }
        public string ApplicationUserId { get; set; }
        public int? EstablishmentId { get; set; }
        public string Role { get; set; }
        public string Email { get; set; }
    }
}
