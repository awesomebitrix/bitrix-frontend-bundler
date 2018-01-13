<pre>
	<?php

		$branch = 'master';

		$commands = [
//			'git add --all',
//			'git commit -m "Changes on production"',
//			"git pull origin {$branch}",
//			'git checkout --theirs .',
//			'git commit -am "Remote Conflict"',
//			"git push origin {$branch}",
			"yarn build"
		];

		foreach($commands as $command) {
			$tmp = shell_exec($command." 2>&1 ");
			echo '<b>' . $command . '</b>' . PHP_EOL;
			echo htmlentities(trim($tmp)) . PHP_EOL . PHP_EOL;
		}
	?>
</pre>