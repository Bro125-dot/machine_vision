import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT = path.resolve(__dirname, '../data')
const cabine = fs.readdirSync(ROOT)

const cabine_vere = cabine.slice(0,5)


export function Loadmapdata(){
    const ExportList = []
    for (const cabina of cabine_vere) {

        const cabinaPath = path.join(ROOT, cabina)

        const robots = fs.readdirSync(cabinaPath)

        for (const robot of robots) {

            const robotPath = path.join(cabinaPath, robot)

            const files = fs.readdirSync(robotPath)

            for (const file of files) {
                if (file === 'map1.log' || file === 'map2.log' || file === 'map3.log' || file === 'map4.log' || file === 'map5.log' || file === 'map6.log' || file === 'map7.log'){
                    const filePath = path.join(robotPath, file)

                    const content = fs.readFileSync(filePath, 'utf-8')
                    ExportList.push({
                        cabina,
                        robot: robot.split(' ')[0],
                        file,
                        content                  
                    })
                }
            }
        }
    }
    return ExportList

}

