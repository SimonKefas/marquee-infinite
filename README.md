Sure! Here’s a **README.md** file for your infinite scrolling marquee. This will help you or anyone else understand how to implement and customize it in projects.  

---

## **🚀 Infinite Scroll Marquee for Webflow & JavaScript Projects**

This is a **highly customizable, smooth, and infinitely looping marquee** that can be used anywhere, including **Webflow or plain HTML projects**. It supports **multiple instances**, **custom scrolling direction**, **gaps between items**, and **fullscreen mode**.

---

## **📌 Features**
✅ **Seamless infinite scrolling** (no jumps or resets)  
✅ **Works inside containers or fullscreen sections**  
✅ **Customizable attributes** for easy integration  
✅ **Supports gaps between items (`mq-gap`)**  
✅ **Fully responsive**  

---

## **💡 How to Use**

### **1️⃣ Add the HTML Structure**
```html
<div mq="wrap" mq-direction="left" mq-fullscreen mq-gap="20">
  <div mq="list">
    <div class="marquee-item">NAV</div>
    <div class="marquee-item">Norwegian✈</div>
    <div class="marquee-item">DNB</div>
    <div class="marquee-item">Røde Kors</div>
  </div>
</div>
```
### **2️⃣ Add the CSS**
```css
[mq="wrap"] {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
  display: flex;
  width: 100%;
}

[mq="list"] {
  display: flex;
  will-change: transform;
  min-width: 100%;
  justify-content: center;
  gap: var(--mq-gap, 0px);
}
```

### **3️⃣ Add the JavaScript**
```html
<script src="https://cdn.jsdelivr.net/gh/SimonKefas/marquee-infinite@latest/script.js"></script>
```

---

## **⚙️ Customization Options**
You can easily customize the behavior using attributes:

| Attribute       | Description                                     | Default  | Example Usage |
|---------------|---------------------------------|---------|--------------------|
| **`mq-direction`**  | Scroll direction (`left` or `right`) | `left` | `mq-direction="right"` |
| **`mq-fullscreen`** | Ensures the marquee covers the full section | _off_ | `mq-fullscreen` |
| **`mq-gap`**  | Space (in pixels) between items | `0` | `mq-gap="20"` |

---

## **📌 Example Use Cases**
✅ **Use inside containers**  
✅ **Make a full-width scrolling logo row**  
✅ **Different scrolling directions on the same page**  
✅ **Add spacing between items dynamically**  

---

## **❓ Need More Features?**
Would you like **pause on hover** or **speed control per instance**? Let me know! 🚀  

---

### **📜 License**
This project is open-source. Feel free to use, modify, and improve it!