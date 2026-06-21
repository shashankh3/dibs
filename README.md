# DIBS (Do It Before Scrap) - Smart Eco-Assistant

## Chosen Vertical
Sustainability & Smart Waste Management Assistant

## Approach and Logic
DIBS serves as a **smart, dynamic assistant** that intelligently routes household items to prevent them from reaching landfills. It uses logical decision-making based on user context (GPS coordinates, pincodes, item condition) to determine the best lifecycle path for any given item.

- **Dynamic Routing**: If an item is in good condition, the assistant routes it to the community via a gamified swipe interface. If it is marked as scrap, it is dynamically routed to the "Scrap Route" heatmap for local dealers.
- **Context-Aware Recommendations**: The assistant calculates real-time distances between users and items, prioritizing local exchanges to minimize carbon footprint.
- **CO2 Impact Tracking**: The system logically calculates the CO2 emissions saved by reusing items, gamifying the experience through an interactive leaderboard.

## How the Solution Works
1. **The Swipe Interface**: Users are presented with items dynamically filtered based on their location context. They can swipe right to "call DIBS", swipe left to pass, or swipe down to instantly re-route the item to the scrap map.
2. **The Scrap Route Heatmap**: A live, interactive map that acts as a visual assistant for Kabadiwalas (scrap dealers), showing them exactly which pincodes have accumulated the most scrap weight.
3. **Live Directory Assistant**: A built-in feature that uses Google Maps to instantly locate and connect users with verified local scrap dealers based on their current context.

## Assumptions Made
- Users have basic access to the internet and location services.
- Standard conversion metrics (e.g., 1kg of electronics = X kg of CO2 saved) are accurate approximations for gamification purposes.
- The informal sector (Kabadiwalas) can navigate interactive heatmaps to optimize their collection routes.

