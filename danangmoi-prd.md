Here's your **Product Requirements Document (PRD)** in English, written in a clean format that AI developers, GIS engineers, or web engineers can easily follow.

* * * * *

**Product Requirements Document (PRD)**
=======================================

**Product Name:** Da Nang Administrative Map Lookup System\
**Project Owner:** City Government of Da Nang\
**Launch Date:** July 1st\
**Purpose:** Support public understanding and transition to new administrative boundaries

* * * * *

1\. **Overview**
----------------

An interactive web application designed to help citizens of Da Nang look up the **new administrative boundaries** (wards/communes) after recent mergers. The system will allow people to:

-   Look up their **new ward based on old address**

-   **See updated boundaries** as polygons on the map

-   **Find public offices**, and get directions to the appropriate administrative branch

-   Use AI to help **analyze and propose new local branches** for optimized citizen access

* * * * *

2\. **Problem Statement**
-------------------------

After the merger of wards/communes effective from **July 1st**, many citizens will be confused about their new administrative unit, where to go for public services, and which office serves their area.

* * * * *

3\. **Target Users**
--------------------

-   General public of Da Nang (including elderly citizens)

-   Public administration officers

-   Businesses and organizations submitting paperwork

-   GIS analysts and government planners

* * * * *

4\. **Core Features**
---------------------

### I. WEB INTERFACE (MAP-BASED UI)

| ID | Feature | Description |
| --- | --- | --- |
| 1.1 | Interactive Map | Shows the entire city of Da Nang with new ward/commune boundaries as **transparent polygons** |
| 1.2 | Ward/Commune Layer Toggle | Allow user to toggle on/off the polygon layer |
| 1.3 | Polygon Click | Clicking on a polygon shows detailed info (name, area, population, office info) |
| 1.4 | Show Headquarters | Markers for public offices: city departments (SBN), ward/commune offices |
| 1.5 | Office Details Popup | Clicking a marker opens a popup with address, contact info, working hours |
| 1.6 | Search by Old Address | User types old address (e.g., "02 Quang Trung, Thach Thang"), result shows **new administrative unit**, and route to new office |
| 1.7 | User Location Detection | Detect user location and **highlight which ward/commune** they are currently in |
| 1.8 | Directions to Office | Button to get route from current location to public office (Google Maps or OpenStreetMap routing) |

* * * * *

### II. AI-BASED OPTIMIZATION

| ID | Feature | Description |
| --- | --- | --- |
| 2.1 | Current Office Data | Existing network: 1 central-level office (Level 1), 20 district land registry branches (Level 2) |
| 2.2 | Distance Constraint | Max allowed distance between branches: ≤ 5km (Option 1), or ≤ 10km (Option 2) |
| 2.3 | Branch Suggestion (AI) | Using polygon data and population density to propose **Level 3 administrative service points** |
| 2.4 | Visualization | Display suggested points as separate markers with different colors |
| 2.5 | Download/Export | Export proposed points in GeoJSON or CSV for planning use |

* * * * *

5\. **User Stories**
--------------------

### Citizen

-   "I want to search my old address and find out which new ward I belong to."

-   "I want to know where the nearest office is and how to get there."

-   "I want to see a map to understand the new boundaries."

### Government Staff

-   "I want to identify underserved areas and plan new service points."

-   "I want to help citizens understand where to go for services."

* * * * *

6\. **Non-functional Requirements**
-----------------------------------

| Category | Requirement |
| --- | --- |
| Performance | Map loads in < 3s, polygon interaction < 200ms |
| Accessibility | Mobile-responsive, contrast mode for elderly users |
| Scalability | Can serve 10,000+ concurrent users (during public announcement) |
| Tech Stack | Web App: ReactJS + Leaflet/Mapbox; Backend: NodeJS/NestJS or ASP.NET; Map Tiles: OpenStreetMap or custom tiles |

* * * * *

7\. **Data Requirements**
-------------------------

-   Polygon GeoJSON for new ward/commune boundaries

-   Office coordinates + metadata (address, phone, type)

-   Old-to-new address mapping dataset (CSV or database)

-   Population heatmap (optional, for AI analysis)

* * * * *

8\. **Stretch Goals**
---------------------

-   Multilingual Support (Vietnamese & English)

-   Voice-based lookup for elderly users

-   Public Feedback / Report issue form

* * * * *

Let me know if you'd like:

-   a **Figma prototype**

-   a **detailed screen-by-screen mockup**

-   or a **technical design document** next.

Also, I can help generate the **AI clustering logic or service planning logic** based on your polygon/GeoJSON inputs.