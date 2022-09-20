This is a demo app showing different approaches, how to import components in pages.

Branches:
 - main (b1)
 - barrel-export-without-hugecomponent (b2)
 - import-hugecomponent-from-file (b3)
 - barrel-export-with-hugecomponent (b4)
 - dynamic-import-barrel-export (b5)
 - dynamic-import-import-from-file (b6)
 
# Overview of demo app (`main` branch)

### Components
 - Component1
 - Component2
   - Both really lightweight components
 
 - HugeComponent
   - This is a component with one dependency (lodash library), which makes the component a bit bigger compared to Component1 and Component2
 

### Pages
 - index
   - This page always renderes Component1. There is always a button - after clicking it, Component2 appears.
   - Depending on branch, HugeComponent is either rendered immediatelly or after clicking button.
   
   
### Build
Index page has size of `78.5 kb` (js bundle includes Component1 and Component2)
![base_build](https://user-images.githubusercontent.com/72815195/191251126-aa76284b-01a2-499e-a7bb-aec58cc56722.png)

### Browser
There isn't any additional JS bundle specifically for components Component1 and Component2, both are included in `index-<ID>.js`. Client has recieved in total `95 kb`
<img width="842" alt="base_browser" src="https://user-images.githubusercontent.com/72815195/191252623-3f3f894a-64f9-4b0f-8d6a-d713c88e3f26.png">

# Branches

## barrel-export-without-hugecomponent (b2)

There is added `index.ts` inside `/components`, which exports each file from the folder (barrel export).
**The problem with barrel export is that now `index` page imports ALL components (including HugeComponent) even that not all of them are used in the page.**
 - `import { Component1, Component2 } from '../components'` looks like we imported just Component1 and Component2. But in the JS bundle, there is also HugeComponent. See build size below
 
### Build
HugeComponent has a lodash dependency, that needs to be included in JS bundle. Therefore, index page has now size of `104 kb` (js bundle includes Component1, Component2, HugeComponent and lodash dependency). **Note that HugeComponent is in the bundle even that is not imported in index page.**
![barrel-export-without-hugecomponent_build](https://user-images.githubusercontent.com/72815195/191257324-187a1dae-0f4e-49eb-a410-c7307beafdba.png)

### Browser

Compared to (b1), there is a new JS bundle `291... .json` 25.5 kb, that includes lodash dependency. Component1, Component2 and HugeComponent are included in `index-<ID>.js` (1 kb). **Note that lodash is not used on index page, but is shipped to the client.**

<img width="829" alt="barrel-export-without-hugecomponent_browser" src="https://user-images.githubusercontent.com/72815195/191258402-cf181e40-1834-449e-b75c-da626f24489a.png">

## import-hugecomponent-from-file (b3)

In index page, there is statically imported HugeComponent from `components/HugeComponent`. HugeComponent is also rendered on initial load (actually if it was rendered after clicking a button, it won't make any difference regarding js bundle size, because the file is imported statically).

### Build and Browser

The same as (b2)

## barrel-export-with-hugecomponent (b4)

Now, there is again barrel export file. This time, it doesn't make any problem, since all components from /components are used on index page. But in real projects, how many pages will use ALL implemented components... ?

### Build and Browser

The same as (b2)

## dynamic-import-barrel-export (b5)

Now, we import Component1 and Component2 from a barrel index file. HugeComponent is imported via `next/dynamic`. HugeComponent is rendered only after clicking a button. We might think that HugeComponent won't be included in first load JS. **But that's not true.** Since we import Component1 and Component2 via barrel file, we import ALL components (including HugeComponent).

### Build

First load js is even bigger due to using `next/dynamic`. What do actually want is to not include HugeComponent in first load js..

![dynamic-import-barrel-export_build](https://user-images.githubusercontent.com/72815195/191265424-9cec0a75-8bec-4b1e-a6f6-6f9826ac7e74.png)

### Browser

The same as (b2) with a difference that `index-<ID>.js` is a bit bigger 2.7 kb due to importing `next/dynamic`

## dynamic-import-import-from-file (b6)

This should be the best implementation. We don't use any barrel index file. We import Component1 and Component2 from their files and HugeComponent is imported dynamically via `next/dynamic`. HugeComponent is rendered after clicking a button, therefore it is not neccessary to include it in first load JS. We need the component (and its dependencies) after clicking a button.

### Build

First load JS of index page is a bit bigger than in `main` branch due to using `next/dynamic`. But HugeComponent is not included!

![dynamic-import-import-from-file_build](https://user-images.githubusercontent.com/72815195/191268326-a6af0ec4-fcb7-4a73-96a1-f4466d579738.png)

### Browser

On first load, there isn't lodash dependency bundle, which is great. Client has recieved in total `95 kb`, the same size as in (b1)

<img width="820" alt="dynamic-import-import-from-file_browser" src="https://user-images.githubusercontent.com/72815195/191268575-c5efd17c-e3b4-4beb-afd1-6db688b2087e.png">

After clicking a button, HugeComponent and its dependency (lodash) is fetched from the server on-demand (`661... .js` and `291... .js`)

<img width="750" alt="dynamic-import-import-from-file_browser-after" src="https://user-images.githubusercontent.com/72815195/191269081-c34ffd91-4918-4da8-9d17-17b22e430665.png">

# Conclusion

In real projects, it could make massive difference, if we import all our components or just those components, that are actually needed for the particular page. Components can have a lot of dependencies to other libraries, which are also fetched unintentionally on pages, where they are not needed.

In a real project, we can save hundreds of kbs per page, which can make massive difference on initial loading time (especially on mobile phones with slower internet connection).






