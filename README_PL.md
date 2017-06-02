[![Wersja](https://img.shields.io/badge/Version-v0.9.2-brightgreen.svg)](https://ambar.cloud)
[![Licencja](https://img.shields.io/badge/License-Fair%20Source%20v0.9-blue.svg)](https://github.com/RD17/ambar/blob/master/License.txt)
[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/ambar/ambar)

Ambar: Proste Zarządzanie Dokumentami
================================

**OUTDATED - USE README.MD AS MANUAL**

Jeśli Ambar Ci się podoba, daj :star:!

[Wstęp](https://ambar.cloud) | [Chmura](https://app.ambar.cloud) | [Blog](https://blog.ambar.cloud)

![Ambar](https://habrastorage.org/files/947/a32/de7/947a32de7156478094e3e12c16e8366c.jpg)

## Czym jest Ambar?
Ambar to prosty system zarządzania dokumentami z automatycznym indeksowaniem, OCR, deduplikacją i bardzo szybkim wyszukiwaniem pełnotekstowym. Wyobraź sobie, że posiadasz miliard plików w różnych formatach, takich jak xls, doc, txt, pdf, ppt itd..., w każdym kodowaniu. Ambar bezpiecznie przechowuje je i daje możliwość przeszukiwania ich zawartości i metadanych w milisekundach. Jest bardzo lekki, prosty i intuicyjny, ale jednocześnie bardzo szybki i wydajny pod względem ilości danych i skalowania. Cała filozofia jest ukryta pod prostym interfejsem.

## Funkcje
[EN: Przegląd funkcji (Vimeo)](https://vimeo.com/202204412)

* Wyszukiwanie pełnotekstowe [EN: Opanowanie zapytań wyszukiwania](https://blog.ambar.cloud/mastering-ambar-search-queries/)
* Indeksowanie plików (SMB, FTP, Mail) [EN: Przeszukiwanie własnych folderów udostępnionych](https://blog.ambar.cloud/advanced-ambar-usage-crawling-your-own-shared-folders/)
* Scheduled Crawling
* Integracja z Dropbox [EN: Przeszukiwanie zawartości Dropbox'a](https://blog.ambar.cloud/how-to-search-through-your-dropbox-files-content/)
* Zaawansowany OCR
* Deduplikacja plików
* Podgląd plików
* Bezpieczne przechowywanie plików
* Statystyki w czasie rzeczywistym
* Interfejs webowy
* [EN: REST API](https://github.com/RD17/ambar/blob/master/API_DOC.md)

## Cloud
W pełni funkcjonalny najnowszy Ambar hostowany na naszych serwerach. Wszystkie konta i dane są zabezpieczone i starannie przechowywane. Możesz podłączyć Ambar bezpośrednio do swojego konta w Dropbox i cieszyć się z potężnego narzędzia pozwalającego przeszukiwać Twój dysk w tej usłudze. Wypróbowanie Ambar Cloud to doskonały sposób, aby przekonać się czym jest Ambar.

 * [EN: Rejestracja](https://app.ambar.cloud/signup)
 * To tyle!

Podstawowe konto Ambar Cloud daje Ci miejsce do przechowywania maksymalnie 2000 dokumentów. Aby przechowywać więcej plików, możesz zmienić plan na wersję Pro.

## Hostowanie na własnych serwerach
Ambar w wersji "self-hosted" może być zainstalowany jako zestaw obrazów dla Dockera. Edycja Community jest dostępna za darmo. Jest to mała część edycji Enterprise, która ma m.in. wyłączoną autoryzację, ale zachowuje pełną funkcjonalność. Możesz także skorzystać z wersji testowej dostępnej dla edycji Enterprise, e-mail kontaktowy to hello@ambar.cloud

* [EN: Jak zainstalować](https://blog.ambar.cloud/ambar-installation-step-by-step-guide-2/)

Obrazy Dockera można znaleźć na [Docker Hub](https://hub.docker.com/u/ambar/)

## Jak to działa
* [EN: Co kryje się "pod maską"](https://blog.ambar.cloud/ambar-under-the-hood/)
* [EN: Dokumentacja REST API](https://github.com/RD17/ambar/blob/master/API_DOC.md)
* Kod źródłowy jest łatwo dostępny na licencji [Fair Source License 1](https://github.com/RD17/ambar/blob/master/License.txt). ([Frontend](https://github.com/RD17/ambar-frontend), [Crawler](https://github.com/RD17/ambar-crawler), [ElasticSearch](https://github.com/RD17/ambar-es), [Rabbit](https://github.com/RD17/ambar-rabbit), [Mongo](https://github.com/RD17/ambar-mongodb), [Installer](https://github.com/RD17/ambar-install))

## FAQ
### Czy Ambar jest otwartoźródłowy?
Tak, niemal każdy moduł Ambar jest publikowany na GitHub na licencji [Fair Source License 1](https://github.com/RD17/ambar/blob/master/License.txt)

### Czy Ambar jest darmowy?
Tak, edycja Community jest darmowa na zawsze. Nie zapłacisz za jej używanie ani grosza. Konto w planie podstawowym jest również darmowe.

### Czy zawiera OCR?
Tak, zawiera OCR i można go używać na zdjęciach (w formatach jpg, tiff, bmp itp) oraz na plikach PDF. OCR jest obsługiwany przez znaną bibliotekę open-source - Tesseract. Dopasowaliśmy ją, aby uzyskać najlepszą jakość skanowanych dokumentów.

### Jakie języki są obsługiwane przez OCR?
Wspierane języki: Angielski, rosyjski, włoski, niemiecki, francuski, hiszpański, holenderski.
Jeśli brakuje ci jakiegoś języka, otwórz temat w zakładce "issues" na GitHub, dodamy go jak najszybciej.

### Czy Ambar obsługuje tagi?
Nie, pracujemy nad tym. Jako alternatywę można używać struktury folderów jako tagów.

### Co z szukaniem w pliku PDF?
Tak, Ambar obsługuje szukanie w plikach PDF, nawet źle zakodowanym lub ze skanami w pliku. Zrobiliśmy wszystko, co mogliśmy by przeszukiwanie plików PDF było płynne.

### Brakuje mi analizatora do języka XXX. Czy będzie dodany?
Tak, proszę założyć temat w zakładce "issues" na GitHub.

### Czy planowane jest dodanie lokalizacji interfejsu?
Pracujemy nad tym, prosimy o cierpliwość i wyrozumiałość.

### Jaki jest maksymalny rozmiar pliku, który obsłuży Ambar?
Jest to ograniczone ilością pamięci RAM maszyny, zazwyczaj 500 MB. To niesamowity wynik, ponieważ typowe systemy zarządzania dokumentami oferują maksymalnie 30 MB rozmiaru przetwarzanego pliku.

### Jaka jest różnica pomiędzy Ambar CE i Ambar EE?
Najprościej mówiąc Ambar CE jest okrojoną wersją Ambar EE. Po więcej informacji zapraszamy [tutaj](https://ambar.cloud/#get-invite)

### Czy inni widzą moje dokumenty?
Nie, sprawdź naszą Politykę Prywatności.

### Mam problem, co powinienem zrobić?
Załóż temat w zakładce "issues" na GitHub lub opowiedz o problemie na https://ambar.cloud

## Zmiany
[EN: Zmiany](https://github.com/RD17/ambar/blob/master/CHANGELOG.md)

## Dziękujemy za wsparcie
- [hartmch](https://github.com/hartmch)

## Polityka Prywatności
[EN: Polityka Prywatności](https://github.com/RD17/ambar/blob/master/Privacy%20Policy.md)

## Licencja
[Fair Source 1 License v0.9](https://github.com/RD17/ambar/blob/master/License.txt)

