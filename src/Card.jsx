import React from 'react'
import { Button } from "flowbite-react";


const Cards = ({title,desc,price, purchasebtn}) => {

  return <>
        <div className="bg-background text-foreground dark:bg-background dark:text-foreground">
            <div className="p-4 rounded-lg shadow-md max-w-xs mx-auto">
                <img src="" alt="Product Image" className="w-full h-48 object-cover rounded-lg"/>
                <div className="mt-4">
                    <h2 className="text-lg font-semibold">Product Title</h2>
                    <p className="text-sm text-muted-foreground mt-2">Product Description goes here. Add some details about the product to entice users.</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-primary font-semibold">$19.99</span>
                        <Button className="bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/80 transition-colors">Purchase </Button>
                    </div>
                </div>
            </div>
        </div>
    </>
}



export default Cards;