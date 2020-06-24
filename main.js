const app = new Vue({
  el: "#app",
  data: {
    brand: "Vue Mastery",
    product: "Socks",
    description: "Wear on Feet",
    details: ["80% cotton", "20% polyester", "Gender-neutral"],
    onSale: false,
    variants: [
      {
        id: 2234,
        color: "green",
        image: "assets/vmSocks-green-onWhite.jpg",
        quantity: 2,
      },
      {
        id: 2235,
        color: "blue",
        image: "assets/vmSocks-blue-onWhite.jpg",
        quantity: 4,
      },
    ],
    variantSelectedId: 2235,
    sizes: ["S", "M", "L", "XL", "XXL", "XXXL"],
    cart: [],
  },
  methods: {
    addToCart() {
      const { variantSelected, variantSelectedId, variants, cart } = this;
      console.log("cart", this.cart, cart);
      if (variantSelected.quantity <= 0) return;
      const inCart = cart.find((variant) => variant.id === variantSelectedId);
      if (inCart) {
        inCart.quantity++;
      } else {
        this.cart.push({ id: this.variantSelectedId, quantity: 1 });
      }
      const vrnt = variants.find((variant) => variant.id === variantSelectedId);
      vrnt.quantity--;
    },
    removeFromCart() {
      const { cart, variantSelectedId, variants } = this;
      if (cart.length <= 0) return;
      const inCart = cart.find((variant) => variant.id === variantSelectedId);
      if (!inCart) return;
      inCart.quantity--;
      const vrnt = variants.find((variant) => variant.id === variantSelectedId);
      vrnt.quantity++;
    },
    variantSelect(id) {
      this.variantSelectedId = id;
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    inStock() {
      return this.variantSelected.quantity > 0;
    },
    cartCount() {
      const { cart } = this;
      if (cart.length <= 0) return 0;
      return cart.reduce((acc, items) => acc + items.quantity, 0);
    },
    canRemove() {
      const { cart, variantSelectedId } = this;
      if (cart.length <= 0) return false;
      const inCart = cart.find((variant) => variant.id === variantSelectedId);
      if (!inCart) return false;
      if (!inCart.quantity) return false;
      if (inCart.quanty <= 0) return false;
      return true;
    },
    variantSelected() {
      console.log(this.variantSelectedId);
      return this.variants.find(
        (variant) => this.variantSelectedId === variant.id
      );
    },
  },
});
