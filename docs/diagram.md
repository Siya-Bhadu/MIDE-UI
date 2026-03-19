

``` mermaid
classDiagram
    class `Client: GuidanceAlgorithmService` {
        -controller: ControllerInterface
        +compute_trajectory_service()
    }

    class `Client Interface: ControllerInterface` {
        <<interface>>
        +get_commands(current_state, target_state)
    }

    class `Adapter: LTCAdapter` {
        -ltc_algorithm: LTCAlgorithm
        +get_commands(current_state, target_state)
    }

    class `Adapter: MPCAdapter` {
        -mpc_algorithm: MPCAlgorithm
        +get_commands(current_state, target_state)
    }

    class `Service: LTCAlgorithm` {
        +calculate_line_of_sight()
        +calculate_loiter_time()
        +check_if_loiter_is_done()
    }

    class `Service: MPCAlgorithm` {
        +optimized_logic()
    }

    `Client: GuidanceAlgorithmService` --> `Client Interface: ControllerInterface`
    `Client Interface: ControllerInterface` <|.. `Adapter: LTCAdapter`
    `Client Interface: ControllerInterface` <|.. `Adapter: MPCAdapter`
    `Adapter: LTCAdapter` --> `Service: LTCAlgorithm`
    `Adapter: MPCAdapter` --> `Service: MPCAlgorithm`
    ```

  