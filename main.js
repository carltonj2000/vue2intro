const eventBus = new Vue();

Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
      
        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }}</li>
          </ul>
        </p>

        <p>
          <label for="name">Name:</label>
          <input id="name" v-model="name">
        </p>
        
        <p>
          <label for="review">Review:</label>      
          <textarea id="review" v-model="review"></textarea>
        </p>
        
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>
            
        <p>
         Would you recommend this product?
         <label><input type="radio" v-model="recommended" value="yes" />yes</label>
         <label><input type="radio" v-model="recommended" value="no" />no</label>
        </p>
            
        <p>
          <input type="submit" value="Submit">  
        </p>    
      
    </form>`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommended: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating && this.recommended) {
        const productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommended: this.recommended,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommended = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.recommended) this.errors.push("Recommendation required.");
      }
    },
  },
});

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>`,
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
    cart: {
      type: Array,
      required: true,
    },
  },
  template: `
      <div class="product">
        <div class="product-image">
          <img :src="variantSelected.image" :alt="description" />
        </div>
        <div class="product-info">
          <h1>{{ title }}</h1>
          <p>Shipping: {{shipping}}</p>
          <p v-if="variantSelected.quantity > 3">
            In Stock ({{ variantSelected.quantity }})
          </p>
          <p v-else-if="variantSelected.quantity > 0">
            Almost Sold Out ({{ variantSelected.quantity }})
          </p>
          <p v-else>Out of Stock</p>
          <p v-show="onSale">On Sale</p>
          <product-details :details="details"></product-details>
          <ul>
            <li :key="size" v-for="size in sizes">{{ size }}</li>
          </ul>
          <div
            v-for="variant in variants"
            :key="variant.id"
            class="color-box"
            :style="{background: variant.color}"
            @mouseover="variantSelect(variant.id)"
          ></div>
        <button
          @click="addToCart"
          :disabled="!inStock"
          :class="{disabledButton: !inStock}"
        >
          Add to Cart
        </button>
        <button
          @click="removeFromCart"
          :disabled="!canRemove"
          :class="{disabledButton: !canRemove}"
        >
          Remove from Cart
        </button>
        </div>

        <product-tabs :reviews="reviews"/>

      </div>
  `,
  data() {
    return {
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
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      const { variantSelected, variantSelectedId, variants } = this;
      if (variantSelected.quantity <= 0) return;
      this.$emit("add-to-cart", variantSelectedId);
      variants.find((variant) => variant.id === variantSelectedId).quantity--;
    },
    removeFromCart() {
      const { variantSelectedId, variants } = this;
      this.$emit("remove-from-cart", variantSelectedId);
      variants.find((variant) => variant.id === variantSelectedId).quantity++;
    },
    variantSelect(id) {
      this.variantSelectedId = id;
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    shipping() {
      return this.premium ? "Free" : 2.99;
    },
    inStock() {
      return this.variantSelected.quantity > 0;
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
      return this.variants.find(
        (variant) => this.variantSelectedId === variant.id
      );
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (review) => this.reviews.push(review));
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
          <div>
            <span
              class="tab"
              :class="{activeTab: selectedTab === tab}"
              v-for="(tab, idx) in tabs"
              :key="idx"
              @click="selectedTab = tab"
            >{{ tab }}</span>
         <div v-show="selectedTab === 'Reviews'">
         <h2>Reviews</h2>
          <p v-if="!reviews.length">There are no reviews yet.</p>
          <ul>
            <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>Recommended: {{ review.recommended }}</p>
              <p>{{ review.review }}</p>
            </li>
          </ul>
        </div>
        <product-review v-show="selectedTab === 'Make a Review'" />
          </div>`,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

const app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    addToCart(id) {
      const inCart = this.cart.find((item) => item.id === id);
      if (inCart) {
        inCart.quantity++;
      } else {
        this.cart.push({ id, quantity: 1 });
      }
    },
    removeFromCart(id) {
      const { cart } = this;
      if (cart.length <= 0) return;
      const inCart = cart.find((item) => item.id === id);
      if (!inCart) return;
      inCart.quantity--;
    },
  },
  computed: {
    cartCount() {
      const { cart } = this;
      if (cart.length <= 0) return 0;
      return cart.reduce((acc, items) => acc + items.quantity, 0);
    },
  },
});
