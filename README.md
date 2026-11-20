# Dollar Kursi

AQSH dollarining so'mga nisbatan bugungi rasmiy kursini ko'rsatadigan va dollar bilan so'm o'rtasida hisoblaydigan kichik veb-sahifa.

**Saytni ochish:** https://dollarkursi.netlify.app/

## Imkoniyatlar

- O'zbekiston Respublikasi Markaziy bankining bugungi dollar kursi
- Kurs kechagiga nisbatan qancha oshgani yoki tushgani
- Kurs sahifa ochilganda va har 5 daqiqada o'zi yangilanadi, "Yangilash" tugmasi bilan qo'lda ham yangilanadi
- Dollardan so'mga va so'mdan dollarga hisoblash, tez summa tugmalari bilan
- Kunduzgi va tungi rejim; tanlangan rejim brauzerda saqlanadi
- Telefon va kompyuterga moslashgan dizayn

## Ma'lumot manbasi

Kurs [Markaziy bank](https://cbu.uz) ochiq API'sidan olinadi. Markaziy bankka ulanib bo'lmasa, kurs zaxira manbadan ([open.er-api.com](https://open.er-api.com)) olinadi. Internet bo'lmasa, oxirgi saqlangan kurs ko'rsatiladi.

Markaziy bank kursi kuniga bir marta belgilanadi. Shuning uchun u Google kabi xizmatlardagi bozor kursidan biroz farq qilishi mumkin.

## Texnologiyalar

- HTML
- CSS
- JavaScript (kutubxonalarsiz)

## Fayllar

```
dollar-kursi/
├── index.html   # sahifa tuzilishi
├── style.css    # dizayn, kunduzgi va tungi rejim
└── script.js    # kursni olish, hisoblash, rejim almashtirish
```
