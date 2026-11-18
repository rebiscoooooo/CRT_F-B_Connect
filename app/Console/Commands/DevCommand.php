<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\DevCommand as BaseDevCommand;
use Illuminate\Foundation\DevCommands;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\NodePackageManager;
use Symfony\Component\Console\Attribute\AsCommand;

use function Termwind\terminal;

#[AsCommand(name: 'dev')]
class DevCommand extends BaseDevCommand
{
    /**
     * Run the dev commands via `concurrently`.
     */
    protected function runViaConcurrently(array $devCommands, NodePackageManager $packageManager): int
    {
        $concurrentlyBin = base_path('node_modules/concurrently/dist/bin/index.js');

        if (file_exists($concurrentlyBin)) {
            $command = 'node "'.str_replace('/', DIRECTORY_SEPARATOR, $concurrentlyBin).'" '.$this->buildConcurrentlyArgs($devCommands);
        } else {
            $command = $packageManager->getExecCommand($this->buildConcurrentlyCommand($devCommands));
        }

        $names = array_column($devCommands, 'name');
        $longestName = ! empty($names) ? max(array_map(strlen(...), $names)) : 0;
        $columns = getenv('COLUMNS');

        putenv('COLUMNS='.max(terminal()->width() - $longestName - 4, 1));

        foreach ($devCommands as $devCommand) {
            $this->line(
                sprintf(
                    '<fg=%s>[%s]</>%s%s',
                    $devCommand['color'],
                    $devCommand['name'],
                    str_repeat(' ', ($longestName - strlen($devCommand['name'])) + 1),
                    $devCommand['command'],
                ),
            );
        }

        $this->line('');

        $process = Process::forever()
            ->options(['create_process_group' => true])
            ->start($command, fn ($type, $output) => $this->output->write($output));

        sapi_windows_set_ctrl_handler($handler = fn () => $process->stop());

        $exitCode = $process->wait()->exitCode();

        sapi_windows_set_ctrl_handler($handler, false);

        $columns === false ? putenv('COLUMNS') : putenv("COLUMNS={$columns}");

        return $exitCode;
    }

    /**
     * Build the arguments to run `concurrently` directly with `node`.
     */
    protected function buildConcurrentlyArgs(array $devCommands): string
    {
        $names = array_column($devCommands, 'name');
        $commands = array_column($devCommands, 'command');
        $colors = array_column($devCommands, 'color');

        $command = sprintf(
            '-c "%s" "%s" --names=%s',
            implode(',', $colors),
            implode('" "', $commands),
            implode(',', $names),
        );

        if (DevCommands::shouldAutoRestart() && ! $this->option('no-restart')) {
            $command .= ' --restart-tries=5 --restart-after=1000';
        } else {
            $command .= ' --kill-others-on-fail';
        }

        if ($this->option('timestamps') || DevCommands::shouldIncludeTimestamps()) {
            $command .= ' --timestamp-format="HH:mm:ss" -p "{time} [{name}]"';
        }

        return $command;
    }
}
