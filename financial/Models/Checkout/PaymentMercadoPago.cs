namespace Models.Checkout
{
    public class PaymentMercadoPago
    {
        public int Installments { get; set; }
        public int EstablishmentId { get; set; }
        public string PaymentMethodId { get; set; }
        public string PaymentCondition { get; set; }
        public string Token { get; set; }
        public DelicatessenOrder DelicatessenOrder { get; set; }
    }
}
