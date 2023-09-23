import { config } from 'dotenv';
import { exec } from 'child_process';

config();
const IP_ADDRESS = process.env.LINODE_IP_ADDRESS
const CLEAN_CMD = `ssh -i ~/.ssh/linode_key root@${IP_ADDRESS} \"rm -rf /var/www/skillstech.app/*\"`
const UPDATE_CMD = `scp -i ~/.ssh/linode_key -r ./dist/* root@${IP_ADDRESS}:/var/www/skillstech.app/`;
exec(CLEAN_CMD, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.error(stderr);
    console.log("Removed old deployment ",stdout);
    exec(UPDATE_CMD,  (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.error(stderr);
        console.log("Updated client code ", stdout);
    })
});