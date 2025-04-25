import { PresenceData } from 'discord.js';

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { client } from '..';

// Load and parse the YAML file
const fileContents = fs.readFileSync('config/richPresence.yaml', 'utf8');
const config: PresenceData = yaml.load(fileContents);

export function setDefaultPresence() {
	return client.user.setPresence(config);
}
