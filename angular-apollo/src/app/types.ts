export type User = {
    user_id: String
    email: String
    password: String
    username: String
    firstname: String
    lastname: String
    type: String 
  }
  
export type AuthPayload ={

      token:String;
      user_id: String
      type:String
    
  }
  
export type Listing= {
  
      listing_id:String;
      listing_title:String;
      description:String;
      street:String;
      city:String;
      postal_code:String;
      price:Number;
      user:User;
}
  
  
export type Booking = {
      listing_id:Listing;
      booking_id:String;
      booking_date:Date;
      booking_start:Date;
      booking_end:Date;
      user:User;
    
  }

  export type Query =
  {
    users: [User]
    user(user_id:String): User

    listings: [Listing]
    listing(listing_id:String):Listing

    bookings: [Booking]
    booking(booking_id:String):Booking
    booking_by_listing(listing_id:Listing):[Booking]

  }

  export type Mutations =
  {
    signup(email: String, password: String, username: String, firstname:String,lastname:String,type:String): User
    signin(email: String, password: String): AuthPayload
    //updateaccount(user_id:ID!, email: String!, password: String!, username: String!, firstname:String!,lastname:String!,type:String!): User
    //deleteaccount(user_id:ID!):Boolean!

    createlisting(listing_title:String, description:String, street: String, city: String, postal_code: String, price: Number): Listing
    //updatelisting(listing_id:ID!, listing_title:String!, description:String!, street: String, city: String!, postal_code: String!, price: Float!): Listing
    //deletelisting(listing_id:ID!):Boolean!

    createbooking(booking_date:Date, booking_start:Date, booking_end:Date): Booking
    //updatebooking(booking_id:ID!, booking_date:Date!, booking_start:Date!, booking_end:Date!):Booking
    //deletebooking(booking_id:ID!):Boolean!
  }

