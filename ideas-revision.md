# Revisión Weather CLI

- [x] **Colores:** no hay ninguno; falta definir cyan (menú), amarillo (temp), verde/rojo (ok/error).
- [ ] **AGENTS.md:** dice que `index.ts` es stub, pero la app ya funciona — hay que actualizarlo.
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [ ] **Binario:** compila bien; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- [ ] **7 day forescast** agregar la posibilidad de obtner el pronóstico de clima para los proximos días
- [ ] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- [ ] **Carga:** ¿hay estado de carga en las tareas asíncronas?

## checklist adicional de revisión:


- [] ¿Usaron ramas?
- [] ¿Usaron pull request?
- [] ¿Qué pasa si tras un nuevo feature, ser rompió otra cosa?
- [] ¿Hicieron el testing? ¿Que probaron?
- [] ¿Su modelo instaló dependencias? ¿Qué depenencias intaló?¿Están de acuerdo ustedes?
- [] ¿Comprenden el código?¿Qué es lo que hace? ¿Qué es lo que no hace?