import { Config } from "@remotion/cli/config";

/**
 * Remotion CLI configuration. See https://remotion.dev/docs/config
 * The compositions live in src/remotion (entry: src/remotion/index.ts).
 */
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(1);
