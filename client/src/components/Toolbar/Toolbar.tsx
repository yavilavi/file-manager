/**
 * File Manager - Toolbar
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Card, Grid } from "@mantine/core";
import HomeDirectoryButton from "./Buttons/HomeDirectoryButton";

const buttons = [
  HomeDirectoryButton,
];

export default function Toolbar() {
  return (
    <>
      <Card shadow="sm">
        <Grid>
          {buttons.map((Button, index) => (
            <Button key={index} />
          ))}
        </Grid>
      </Card>
    </>
  );
}
